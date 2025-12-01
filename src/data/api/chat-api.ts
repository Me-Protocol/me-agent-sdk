/**
 * Chat API
 * Handles chat messages and SSE streaming
 */

import { BaseAPI } from "./base-api";
import { SendMessagePayload, QueryResponse } from "../../types";

export class ChatAPI extends BaseAPI {
  /**
   * Send a message and handle streaming response via SSE
   */
  async sendMessage(
    sessionId: string | null,
    message: string,
    onChunk: (chunk: string, rawData?: any) => void,
    onComplete: (sessionId: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const payload: SendMessagePayload = {
        query: message,
        user_id: this.userId,
      };

      // Only include session_id if it exists
      if (sessionId) {
        payload.session_id = sessionId;
      }

      const headers: Record<string, string> = {};

      // Add email header if provided
      if (this.config.emailAddress) {
        headers["x-user-email"] = this.config.emailAddress;
      }

      console.log("[ChatAPI] Sending message to /query:", payload);

      const response = await fetch(`${this.env.AGENT_BASE_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(payload),
      });

      console.log("[ChatAPI] Response status:", response.status);
      console.log(
        "[ChatAPI] Response headers:",
        response.headers.get("content-type")
      );

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      // Check if response is SSE or regular JSON
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("text/event-stream")) {
        console.log("[ChatAPI] Handling as SSE stream");
        await this.handleSSEStream(response, onChunk, onComplete);
      } else {
        console.log("[ChatAPI] Handling as regular JSON");
        // Handle as regular JSON response
        const data = await response.json();
        console.log("[ChatAPI] JSON response:", data);

        if (data.response !== undefined) {
          onChunk(data.response, data);
        }

        onComplete(data.session_id || "");
      }
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
    onComplete: (sessionId: string) => void
  ): Promise<void> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    let buffer = "";
    let returnedSessionId: string | null = null;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Pass session ID to onComplete
        onComplete(returnedSessionId || "");
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data && data !== "[DONE]") {
            const sessionId = this.processSSEData(data, onChunk);
            if (sessionId) {
              returnedSessionId = sessionId;
            }
          }
        }
      }
    }
  }

  /**
   * Process individual SSE data chunks
   * Returns the session_id if found in the response
   */
  private processSSEData(
    data: string,
    onChunk: (chunk: string, rawData?: any) => void
  ): string | null {
    try {
      const parsed = JSON.parse(data);

      console.log("[ChatAPI] Received SSE data:", parsed);

      // New format: { response, session_id, function_response }
      if (parsed.response !== undefined) {
        console.log(
          "[ChatAPI] New format detected, response:",
          parsed.response
        );
        // Extract the text response (call onChunk even if response is empty string)
        onChunk(parsed.response || "", parsed);

        // Return session_id if present
        return parsed.session_id || null;
      }

      // Legacy format support (old API responses)
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

      return null;
    } catch (e) {
      // If not JSON, treat as plain text chunk
      onChunk(data);
      return null;
    }
  }
}
