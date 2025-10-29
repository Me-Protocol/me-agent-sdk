import { MagicConfig } from "../data/auth/magic-client";
import { APIClient } from "../api/client";
import { OfferDetail, RewardBalance, SwapAmountResponse } from "../types";
/**
 * Redemption Manager
 * Handles the complete offer redemption flow
 */
export declare class RedeemManager {
    private magicClient;
    private apiClient;
    private walletAddress;
    private balances;
    private openRewardDiamond;
    private meProtocolLoggedIn;
    private currentEmail;
    private meProtocolToken;
    constructor(apiClient: APIClient, magicConfig: MagicConfig, openRewardDiamond: string);
    /**
     * Get email from config or stored email
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
     * @param selectedRewardAddress - The contract address of the reward the user selected to use
     * @param offerDetail - The offer detail containing the reward they want to redeem for
     * @param selectedVariantId - Optional variant ID if the offer has variants
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
