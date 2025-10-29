/**
 * Session Service
 * Business logic for session and message management
 */
import { Message, ChatState } from "../types";
import { SessionAPI } from "../data/api/session-api";
import { ChatAPI } from "../data/api/chat-api";
/**
 * Session Service
 * Handles session creation and message management
 */
export declare class SessionService {
    private sessionAPI;
    private chatAPI;
    private sessionId;
    private messages;
    constructor(sessionAPI: SessionAPI, chatAPI: ChatAPI);
    /**
     * Initialize or get existing session
     */
    getOrCreateSession(): Promise<string>;
    /**
     * Get current session ID
     */
    getSessionId(): string | null;
    /**
     * Send a message in the current session
     */
    sendMessage(content: string, onChunk: (chunk: string, rawData?: any) => void, onComplete: () => void, onError: (error: Error) => void): Promise<void>;
    /**
     * Add a message to history
     */
    addMessage(message: Message): void;
    /**
     * Update the last message content
     */
    updateLastMessage(content: string): void;
    /**
     * Get all messages
     */
    getMessages(): Message[];
    /**
     * Get chat state
     */
    getChatState(): ChatState;
    /**
     * Clear all messages
     */
    clearMessages(): void;
    /**
     * Create a message object
     */
    createMessage(role: "user" | "assistant" | "system", content: string): Message;
}
