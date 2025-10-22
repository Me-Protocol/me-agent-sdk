import { ChatState, Message } from '../types';

/**
 * State Manager - Handles chat state management
 */
export class StateManager {
  private state: ChatState;
  private listeners: Set<(state: ChatState) => void>;

  constructor() {
    this.state = {
      isOpen: false,
      messages: [],
      sessionId: null,
      isLoading: false,
    };
    this.listeners = new Set();
  }

  /**
   * Get current state
   */
  getState(): ChatState {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   */
  setState(updates: Partial<ChatState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: ChatState) => void): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * Add a message to the chat
   */
  addMessage(message: Message): void {
    this.setState({
      messages: [...this.state.messages, message],
    });
  }

  /**
   * Update the last message (for streaming)
   */
  updateLastMessage(content: string): void {
    const messages = [...this.state.messages];
    if (messages.length > 0) {
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        content,
      };
      this.setState({ messages });
    }
  }

  /**
   * Set session ID
   */
  setSessionId(sessionId: string): void {
    this.setState({ sessionId });
  }

  /**
   * Toggle chat open/closed
   */
  toggleChat(): void {
    this.setState({ isOpen: !this.state.isOpen });
  }

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this.setState({ isLoading });
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.setState({ messages: [] });
  }
}

