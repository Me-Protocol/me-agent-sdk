import { ChatState, Message } from '../types';
/**
 * State Manager - Handles chat state management
 */
export declare class StateManager {
    private state;
    private listeners;
    constructor();
    /**
     * Get current state
     */
    getState(): ChatState;
    /**
     * Update state and notify listeners
     */
    setState(updates: Partial<ChatState>): void;
    /**
     * Subscribe to state changes
     */
    subscribe(listener: (state: ChatState) => void): () => void;
    /**
     * Notify all listeners of state change
     */
    private notifyListeners;
    /**
     * Add a message to the chat
     */
    addMessage(message: Message): void;
    /**
     * Update the last message (for streaming)
     */
    updateLastMessage(content: string): void;
    /**
     * Set session ID
     */
    setSessionId(sessionId: string): void;
    /**
     * Toggle chat open/closed
     */
    toggleChat(): void;
    /**
     * Set loading state
     */
    setLoading(isLoading: boolean): void;
    /**
     * Clear all messages
     */
    clearMessages(): void;
}
