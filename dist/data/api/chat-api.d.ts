/**
 * Chat API
 * Handles chat messages and SSE streaming
 */
import { BaseAPI } from "./base-api";
export declare class ChatAPI extends BaseAPI {
    /**
     * Send a message and handle streaming response via SSE
     */
    sendMessage(sessionId: string, message: string, onChunk: (chunk: string, rawData?: any) => void, onComplete: () => void, onError: (error: Error) => void): Promise<void>;
    /**
     * Handle Server-Sent Events (SSE) stream
     */
    private handleSSEStream;
    /**
     * Process individual SSE data chunks
     */
    private processSSEData;
}
