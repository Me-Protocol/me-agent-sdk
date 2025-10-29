/**
 * Session Service
 * Business logic for session and message management
 */

import { Message, ChatState } from "../types";
import { SessionAPI } from "../data/api/session-api";
import { ChatAPI } from "../data/api/chat-api";
import { generateId } from "../core/utils/formatters";

/**
 * Session Service
 * Handles session creation and message management
 */
export class SessionService {
  private sessionId: string | null = null;
  private messages: Message[] = [];

  constructor(private sessionAPI: SessionAPI, private chatAPI: ChatAPI) {}

  /**
   * Initialize or get existing session
   */
  async getOrCreateSession(): Promise<string> {
    if (!this.sessionId) {
      this.sessionId = await this.sessionAPI.createSession();
    }
    return this.sessionId;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Send a message in the current session
   */
  async sendMessage(
    content: string,
    onChunk: (chunk: string, rawData?: any) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const sessionId = await this.getOrCreateSession();

    // Add user message to history
    const userMessage = this.createMessage("user", content);
    this.messages.push(userMessage);

    // Send via API
    await this.chatAPI.sendMessage(
      sessionId,
      content,
      onChunk,
      onComplete,
      onError
    );
  }

  /**
   * Add a message to history
   */
  addMessage(message: Message): void {
    this.messages.push(message);
  }

  /**
   * Update the last message content
   */
  updateLastMessage(content: string): void {
    if (this.messages.length > 0) {
      this.messages[this.messages.length - 1].content = content;
    }
  }

  /**
   * Get all messages
   */
  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Get chat state
   */
  getChatState(): ChatState {
    return {
      isOpen: false,
      messages: this.getMessages(),
      sessionId: this.sessionId,
      isLoading: false,
    };
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.messages = [];
  }

  /**
   * Create a message object
   */
  createMessage(
    role: "user" | "assistant" | "system",
    content: string
  ): Message {
    return {
      id: generateId(),
      role,
      content,
      timestamp: Date.now(),
    };
  }
}
