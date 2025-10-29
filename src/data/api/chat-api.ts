/**
 * Chat API
 * Handles chat messages and SSE streaming
 */

import { BaseAPI } from "./base-api";
import { SendMessagePayload } from "../../types";

export class ChatAPI extends BaseAPI {
  /**
   * Send a message and handle streaming response via SSE
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

      const headers: Record<string, string> = {};

      // Add email header if provided
      if (this.config.emailAddress) {
        headers["x-user-email"] = this.config.emailAddress;
      }

      const response = await fetch(`${this.env.AGENT_BASE_URL}/run_sse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      // Handle SSE streaming response
      await this.handleSSEStream(response, onChunk, onComplete);
    } catch (error) {
      console.error("Error sending message:", error);
      onError(error as Error);
    }
  }

  /**
   * Handle Server-Sent Events (SSE) stream
   */
  private async handleSSEStream(
    response: Response,
    onChunk: (chunk: string, rawData?: any) => void,
    onComplete: () => void
  ): Promise<void> {
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
            this.processSSEData(data, onChunk);
          }
        }
      }
    }
  }

  /**
   * Process individual SSE data chunks
   */
  private processSSEData(
    data: string,
    onChunk: (chunk: string, rawData?: any) => void
  ): void {
    try {
      const parsed = JSON.parse(data);

      // Extract text from content.parts[0].text
      if (parsed.content?.parts?.[0]?.text) {
        const text = parsed.content.parts[0].text;
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
