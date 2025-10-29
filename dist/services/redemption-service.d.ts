/**
 * Redemption Service
 * Handles the complete offer redemption flow
 */
import { MagicConfig } from "../data/auth/magic-client";
import { AuthAPI } from "../data/api/auth-api";
import { RewardAPI } from "../data/api/reward-api";
import { OfferDetail, RewardBalance, SwapAmountResponse } from "../types";
export declare class RedemptionService {
    private magicClient;
    private authAPI;
    private rewardAPI;
    private walletAddress;
    private balances;
    private openRewardDiamond;
    private meProtocolLoggedIn;
    private currentEmail;
    private meProtocolToken;
    constructor(authAPI: AuthAPI, rewardAPI: RewardAPI, magicConfig: MagicConfig, openRewardDiamond: string);
    /**
     * Get email from stored or config
     */
    getEmail(): string | null;
    /**
     * Set email (for OTP flow)
     */
    setEmail(email: string): void;
    /**
     * Check if Magic is configured
     */
    isMagicConfigured(): boolean;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): Promise<boolean>;
    /**
     * Get wallet address (with force refresh option)
     */
    getWalletAddress(forceRefresh?: boolean): Promise<string>;
    /**
     * Clear cached wallet address (useful after logout or re-authentication)
     */
    clearWalletAddressCache(): void;
    /**
     * Send OTP to email
     */
    sendOTP(email: string): Promise<void>;
    /**
     * Login to ME Protocol (creates account if new user)
     */
    loginToMEProtocol(): Promise<void>;
    /**
     * Check if user is logged in to ME Protocol
     */
    isMEProtocolLoggedIn(): boolean;
    /**
     * Fetch user's reward balances
     */
    fetchBalances(): Promise<RewardBalance[]>;
    /**
     * Calculate swap amount for redemption
     */
    calculateSwapAmount(selectedRewardAddress: string, offerDetail: OfferDetail, selectedVariantId?: string): Promise<SwapAmountResponse>;
    /**
     * Update Magic network configuration
     */
    updateNetwork(brandNetwork: string): Promise<void>;
    /**
     * Check if user can afford the offer with selected reward
     */
    canAffordOffer(selectedReward: RewardBalance, amountNeeded: number): boolean;
    /**
     * Get cached balances
     */
    getCachedBalances(): RewardBalance[];
    /**
     * Clear wallet address cache
     */
    clearCache(): void;
    /**
     * Logout - REMOVED: Users should stay logged in
     * Kept for backward compatibility but does nothing
     */
    logout(): Promise<void>;
}
