/**
 * Auth API
 * Handles authentication endpoints
 */

import { BaseAPI } from "./base-api";
import { MELoginResponse } from "../../types";

export class AuthAPI extends BaseAPI {
  /**
   * Login to ME Protocol (creates account if new user)
   */
  async meProtocolLogin(
    email: string,
    walletAddress: string
  ): Promise<MELoginResponse> {
    try {
      const data = await this.post<MELoginResponse>(
        `${this.env.API_URL}auth/sdk/login`,
        {
          walletAddress,
          email,
        }
      );
      return data;
    } catch (error) {
      console.error("Error in ME Protocol login:", error);
      throw error;
    }
  }
}
