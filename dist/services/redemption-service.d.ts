/**
 * Redemption Service
 * Handles the complete offer redemption flow
 */
import { MagicConfig } from "../data/auth/magic-client";
import { AuthAPI } from "../data/api/auth-api";
import { RewardAPI } from "../data/api/reward-api";
import { RedemptionAPI } from "../data/api/redemption-api";
import { OfferDetail, RewardBalance, SwapAmountResponse, RedemptionOrder } from "../types";
export declare class RedemptionService {
    private magicClient;
    private authAPI;
    private rewardAPI;
    private redemptionAPI;
    private walletAddress;
    private balances;
    private openRewardDiamond;
    private meProtocolLoggedIn;
    private currentEmail;
    private meProtocolToken;
    private currentOrder;
    private chainId;
    private rpcUrl;
    private runtimeUrl;
    private meApiKey;
    private apiV1Url;
    private gelatoApiKey;
    private brandId;
    constructor(authAPI: AuthAPI, rewardAPI: RewardAPI, redemptionAPI: RedemptionAPI, magicConfig: MagicConfig, openRewardDiamond: string, chainId: number, rpcUrl: string, runtimeUrl: string, meApiKey: string, apiV1Url: string, gelatoApiKey: string, brandId: string);
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
    /**
     * Ensure user is logged in to Magic (triggers OTP if not)
     * Also verifies that the logged-in email matches the SDK email
     */
    ensureMagicLogin(email: string): Promise<void>;
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
     * Execute same brand redemption transaction
     * Used when the selected reward is from the same brand as the offer
     */
    executeSameBrandRedemption(rewardAddress: string, rewardId: string, amount: string, offerId: string, redemptionMethodId: string, variantId?: string): Promise<RedemptionOrder>;
    /**
     * Execute cross brand redemption transaction
     * Used when the selected reward is from a different brand than the offer
     */
    executeCrossBrandRedemption(rewardAddress: string, rewardId: string, amount: string, neededAmount: string, brandRewardAddress: string, offerId: string, redemptionMethodId: string, variantId?: string): Promise<RedemptionOrder>;
    /**
     * Process order after successful transaction
     */
    private processOrder;
    /**
     * Get checkout URL for the redeemed offer
     */
    getCheckoutUrl(brandId: string, productVariantIdOnBrandSite: string): Promise<string>;
    /**
     * Get current order
     */
    getCurrentOrder(): RedemptionOrder | null;
    /**
     * Clear current order
     */
    clearCurrentOrder(): void;
    /**
     * Logout - REMOVED: Users should stay logged in
     * Kept for backward compatibility but does nothing
     */
    logout(): Promise<void>;
}
