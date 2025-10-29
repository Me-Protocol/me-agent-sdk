/**
 * Message Types
 * All types related to chat messages and sessions
 */
/**
 * Message roles
 */
export type MessageRole = "user" | "assistant" | "system";
/**
 * Message structure
 */
export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: number;
}
/**
 * Chat state
 */
export interface ChatState {
    isOpen: boolean;
    messages: Message[];
    sessionId: string | null;
    isLoading: boolean;
}
/**
 * Session response from API
 */
export interface SessionResponse {
    id: string;
    appName: string;
    userId: string;
    state: Record<string, any>;
    events: any[];
    lastUpdateTime: number;
}
/**
 * API message payload
 */
export interface SendMessagePayload {
    appName: string;
    userId: string;
    sessionId: string;
    newMessage: {
        parts: Array<{
            text: string;
        }>;
        role: string;
    };
    streaming: boolean;
}
/**
 * Quick action button configuration
 */
export interface QuickAction {
    id: string;
    label: string;
    value: string;
    icon?: string;
}
