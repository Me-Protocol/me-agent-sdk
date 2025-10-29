/**
 * Reward API
 * Handles reward and redemption endpoints
 */
import { BaseAPI } from "./base-api";
import { SwapAmountPayload, SwapAmountResponse } from "../../types";
export declare class RewardAPI extends BaseAPI {
    /**
     * Fetch user reward balances
     */
    fetchRewardBalances(walletAddress: string, token: string): Promise<any[]>;
    /**
     * Fetch swap amount needed for redemption
     */
    fetchSwapAmount(payload: SwapAmountPayload, token: string): Promise<SwapAmountResponse>;
}
