/**
 * Session API
 * Handles session creation and management
 */

import { BaseAPI } from "./base-api";
import {
  SessionResponse,
  ListSessionsResponse,
  ConversationsResponse,
} from "../../types";

export class SessionAPI extends BaseAPI {
  /**
   * Create a new chat session
   */
  async createSession(): Promise<string> {
    try {
      const data = await this.post<SessionResponse>(
        `${this.env.AGENT_BASE_URL}/apps/consumer/users/${this.userId}/sessions`,
        {}
      );
      return data.id;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(): Promise<ListSessionsResponse> {
    try {
      const data = await this.get<ListSessionsResponse>(
        `${this.env.AGENT_BASE_URL}/sessions/${this.userId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      throw error;
    }
  }

  /**
   * Get conversation messages for a session
   */
  async getConversation(sessionId: string): Promise<ConversationsResponse> {
    try {
      const data = await this.get<ConversationsResponse>(
        `${this.env.AGENT_BASE_URL}/conversations/${this.userId}/${sessionId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw error;
    }
  }

  /**
   * Delete a chat session
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await this.delete(
        `${this.env.AGENT_BASE_URL}/sessions/${this.userId}/${sessionId}`
      );
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  }
}
