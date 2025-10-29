/**
 * Session API
 * Handles session creation and management
 */

import { BaseAPI } from "./base-api";
import { SessionResponse } from "../../types";

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
}
