/**
 * Reward API
 * Handles reward and redemption endpoints
 */

import { BaseAPI } from "./base-api";
import { SwapAmountPayload, SwapAmountResponse } from "../../types";

export class RewardAPI extends BaseAPI {
  /**
   * Fetch user reward balances
   */
  async fetchRewardBalances(
    walletAddress: string,
    token: string
  ): Promise<any[]> {
    try {
      const result = await this.get<{ data: any[] }>(
        `${this.env.API_URL}reward/sdk/balances?walletAddress=${walletAddress}`,
        {
          "x-access-token": token,
          Authorization: `Bearer ${token}`,
          "x-public-key": this.env.ME_API_KEY,
        }
      );
      return result.data || [];
    } catch (error) {
      console.error("Error fetching reward balances:", error);
      throw error;
    }
  }

  /**
   * Fetch swap amount needed for redemption
   */
  async fetchSwapAmount(
    payload: SwapAmountPayload,
    token: string
  ): Promise<SwapAmountResponse> {
    try {
      const result = await this.post<{ data: SwapAmountResponse }>(
        `${this.env.API_URL}reward/sdk/swap-amount`,
        payload,
        {
          "x-access-token": token,
          Authorization: `Bearer ${token}`,
          "x-public-key": this.env.ME_API_KEY,
        }
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching swap amount:", error);
      throw error;
    }
  }
}
