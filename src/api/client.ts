import {
  MeAgentConfig,
  SessionResponse,
  SendMessagePayload,
  OfferDetail,
  MELoginResponse,
  SwapAmountPayload,
  SwapAmountResponse,
} from "../types";
import { EnvConfig } from "../config/env";

/**
 * API Client - Handles communication with backend
 */
export class APIClient {
  private config: MeAgentConfig;
  private env: EnvConfig;
  private userId: string;

  constructor(config: MeAgentConfig, env: EnvConfig) {
    this.config = config;
    this.env = env;
    this.userId = config.userId || this.generateUUID();
  }

  /**
   * Get user email from config
   */
  getUserEmail(): string | undefined {
    return this.config.emailAddress;
  }

  /**
   * Generate a UUID v4
   */
  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Create a new session
   */
  async createSession(): Promise<string> {
    try {
      const response = await fetch(
        `${this.env.AGENT_BASE_URL}/apps/consumer/users/${this.userId}/sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      const data: SessionResponse = await response.json();
      return data.id;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  /**
   * Send a message and handle streaming response
   */
  async sendMessage(
    sessionId: string,
    message: string,
    onChunk: (chunk: string, rawData?: any) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const payload: SendMessagePayload = {
        appName: "consumer",
        userId: this.userId,
        sessionId: sessionId,
        newMessage: {
          parts: [{ text: message }],
          role: "user",
        },
        streaming: true,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add email header if provided
      if (this.config.emailAddress) {
        headers["x-user-email"] = this.config.emailAddress;
      }

      const response = await fetch(`${this.env.AGENT_BASE_URL}/run_sse`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      // Handle SSE streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data && data !== "[DONE]") {
              try {
                const parsed = JSON.parse(data);

                // Extract text from content.parts[0].text
                if (parsed.content?.parts?.[0]?.text) {
                  const text = parsed.content.parts[0].text;
                  // If partial=false, this is the final complete message
                  // We should replace, not append
                  onChunk(text, parsed);
                } else if (parsed.content?.parts?.[0]?.functionCall) {
                  // Function call - pass along but no text chunk
                  onChunk("", parsed);
                } else if (parsed.content?.parts?.[0]?.functionResponse) {
                  // Function response - pass along but no text chunk
                  onChunk("", parsed);
                } else if (parsed.chunk) {
                  onChunk(parsed.chunk, parsed);
                } else if (parsed.text) {
                  onChunk(parsed.text, parsed);
                }
              } catch (e) {
                // If not JSON, treat as plain text chunk
                onChunk(data);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      onError(error as Error);
    }
  }

  /**
   * Fetch offer details
   */
  async fetchOfferDetails(
    offerCode: string,
    sessionId: string
  ): Promise<OfferDetail> {
    try {
      const response = await fetch(
        `${this.env.API_V1_URL}store/offer/${offerCode}?sessionId=${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch offer details: ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching offer details:", error);
      throw error;
    }
  }

  /**
   * Fetch user reward balances
   */
  async fetchRewardBalances(
    walletAddress: string,
    token: string
  ): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.env.API_URL}reward/sdk/balances?walletAddress=${walletAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch reward balances: ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Error fetching reward balances:", error);
      throw error;
    }
  }

  /**
   * Fetch swap amount needed for redemption
   */
  async fetchSwapAmount(
    payload: SwapAmountPayload,
    token: string
  ): Promise<SwapAmountResponse> {
    try {
      const response = await fetch(
        `${this.env.API_URL}reward/sdk/swap-amount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch swap amount: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching swap amount:", error);
      throw error;
    }
  }

  /**
   * Login to ME Protocol (creates account if new user)
   */
  async meProtocolLogin(
    email: string,
    walletAddress: string
  ): Promise<MELoginResponse> {
    try {
      const response = await fetch(`${this.env.API_URL}auth/sdk/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
      }

      const data: MELoginResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error in ME Protocol login:", error);
      throw error;
    }
  }
}
