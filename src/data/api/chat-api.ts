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

      console.log("[ChatAPI] Sending message to /query/stream:", payload);

      const response = await fetch(`${this.env.AGENT_BASE_URL}/query/stream`, {
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

      // Streaming endpoint always returns SSE
      console.log("[ChatAPI] Handling SSE stream from /query/stream");
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
   * Process individual SSE data chunks from /query/stream endpoint
   *
   * Streaming format:
   * - Status events: {"type": "status", "event": "started|tool_call|results_found", ...}
   * - Result event: {"type": "result", "text": "...", "data": {...}, "session_id": "..."}
   *
   * Returns the session_id if found in the response
   */
  private processSSEData(
    data: string,
    onChunk: (chunk: string, rawData?: any) => void
  ): string | null {
    try {
      const parsed = JSON.parse(data);

      console.log("[ChatAPI] Received SSE data:", parsed);

      // Handle streaming format from /query/stream
      if (parsed.type === "status") {
        // Status events (started, tool_call, results_found)
        console.log("[ChatAPI] Status event:", parsed.event);

        // Pass status events to handler for UI updates
        if (parsed.event === "tool_call") {
          // Create function_call format for MessageParser compatibility
          onChunk("", {
            content: {
              parts: [{
                functionCall: {
                  name: parsed.tool,
                  args: parsed.args
                }
              }]
            }
          });
        }
        // Other status events can be used for loading states
        return null;
      }

      if (parsed.type === "result") {
        // Final result with text and structured data
        console.log("[ChatAPI] Result event, text:", parsed.text);

        // Convert streaming data format to function_response format for MessageParser
        const functionResponses: any[] = [];

        if (parsed.data?.offers?.length > 0) {
          functionResponses.push({
            name: "query_offers",
            response: {
              matches: parsed.data.offers.map((offer: any) => [
                offer.id,
                offer.name,
                offer.code,
                offer.price,
                offer.description,
                null, // allowedCombinations
                null, // redemptionMethodName
                offer.discounts,
                offer.variant,
                null, // shippingLocation
                null, // review
                offer.brand,
                offer.image_url
              ]),
              count: parsed.data.offers.length
            }
          });
        }

        if (parsed.data?.products?.length > 0) {
          functionResponses.push({
            name: "query_products",
            response: {
              // Convert streaming format to MessageParser expected format
              matches: parsed.data.products.map((product: any) => ({
                product_id: product.id,
                product_name: product.name,
                brand_name: product.brand,
                category_name: product.category,
                description: product.description || "",
                price: product.price,
                discounts: product.discounts || [],
                brand_shopify_url: product.brand_shopify_url || "",
                productUrl: product.product_url,
                coverImage: product.image_url
              })),
              count: parsed.data.products.length
            }
          });
        }

        if (parsed.data?.categories?.length > 0) {
          functionResponses.push({
            name: "get_categories",
            response: {
              categories: parsed.data.categories,
              count: parsed.data.categories.length
            }
          });
        }

        // Send text with function responses
        const responseData: any = {
          response: parsed.text,
          session_id: parsed.session_id
        };

        // Add first function response if available
        if (functionResponses.length > 0) {
          responseData.function_response = functionResponses[0];
        }

        onChunk(parsed.text || "", responseData);
        return parsed.session_id || null;
      }

      if (parsed.type === "error") {
        console.error("[ChatAPI] Error event:", parsed.message);
        onChunk("Sorry, something went wrong. Please try again.", parsed);
        return null;
      }

      // Fallback: Legacy format support
      if (parsed.response !== undefined) {
        onChunk(parsed.response || "", parsed);
        return parsed.session_id || null;
      }

      return null;
    } catch (e) {
      // If not JSON, treat as plain text chunk
      console.warn("[ChatAPI] Failed to parse SSE data:", e);
      onChunk(data);
      return null;
    }
  }
}
