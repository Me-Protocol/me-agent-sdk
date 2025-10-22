import { MagicClient, MagicConfig } from "../auth/magic";
import { APIClient } from "../api/client";
import {
  OfferDetail,
  RewardBalance,
  SwapAmountResponse,
  MELoginResponse,
} from "../types";

/**
 * Redemption Manager
 * Handles the complete offer redemption flow
 */
export class RedeemManager {
  private magicClient: MagicClient | null = null;
  private apiClient: APIClient;
  private walletAddress: string | null = null;
  private balances: RewardBalance[] = [];
  private openRewardDiamond: string;
  private meProtocolLoggedIn: boolean = false;
  private currentEmail: string | null = null;
  private meProtocolToken: string | null = null;

  constructor(
    apiClient: APIClient,
    magicConfig: MagicConfig,
    openRewardDiamond: string
  ) {
    this.apiClient = apiClient;
    this.magicClient = new MagicClient(magicConfig);
    this.openRewardDiamond = openRewardDiamond;
  }

  /**
   * Get email from config or stored email
   */
  getEmail(): string | null {
    return this.currentEmail || this.apiClient.getUserEmail() || null;
  }

  /**
   * Set email (for OTP flow)
   */
  setEmail(email: string): void {
    this.currentEmail = email;
  }

  /**
   * Check if Magic is configured
   */
  isMagicConfigured(): boolean {
    return this.magicClient !== null;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    if (!this.magicClient) {
      return false;
    }

    try {
      return await this.magicClient.isLoggedIn();
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  /**
   * Get wallet address (with force refresh option)
   */
  async getWalletAddress(forceRefresh: boolean = false): Promise<string> {
    // Use cached value unless force refresh is requested
    if (this.walletAddress && !forceRefresh) {
      return this.walletAddress;
    }

    if (!this.magicClient) {
      throw new Error("Magic is not configured");
    }

    try {
      // First verify user is logged in
      const isLoggedIn = await this.magicClient.isLoggedIn();

      if (!isLoggedIn) {
        throw new Error("User is not logged in to Magic");
      }

      // Retry logic for fetching wallet address (Magic might need a moment)
      let retries = 3;
      let lastError: Error | null = null;

      while (retries > 0) {
        try {
          // Fetch wallet address from Magic
          this.walletAddress = await this.magicClient.getWalletAddress();

          if (this.walletAddress) {
            return this.walletAddress;
          }

          // If null, wait and retry
          console.warn("Wallet address is null, retrying...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          retries--;
        } catch (err) {
          lastError = err as Error;
          console.warn(`Error on attempt ${4 - retries}:`, err);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          retries--;
        }
      }

      // All retries failed
      throw new Error(
        `Failed to retrieve wallet address from Magic after 3 attempts. Last error: ${
          lastError?.message || "Unknown"
        }`
      );
    } catch (error) {
      console.error("Error getting wallet address:", error);
      throw error;
    }
  }

  /**
   * Clear cached wallet address (useful after logout or re-authentication)
   */
  clearWalletAddressCache(): void {
    this.walletAddress = null;
  }

  /**
   * Send OTP to email
   */
  async sendOTP(email: string): Promise<void> {
    if (!this.magicClient) {
      throw new Error("Magic is not configured");
    }

    try {
      this.currentEmail = email; // Store email for later use
      await this.magicClient.loginWithEmailOTP(email);
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }

  /**
   * Login to ME Protocol (creates account if new user)
   */
  async loginToMEProtocol(): Promise<void> {
    try {
      const email = this.getEmail();

      if (!email) {
        throw new Error("Email not available");
      }

      // Force refresh wallet address to ensure we have the latest from Magic
      const walletAddress = await this.getWalletAddress(true);

      // Login to ME Protocol (this creates account if new user)
      const loginResponse = await this.apiClient.meProtocolLogin(
        email,
        walletAddress
      );

      if (loginResponse.data.user && loginResponse.data.token) {
        this.meProtocolLoggedIn = true;
        this.meProtocolToken = loginResponse.data.token; // Store the token
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error logging in to ME Protocol:", error);
      throw error;
    }
  }

  /**
   * Check if user is logged in to ME Protocol
   */
  isMEProtocolLoggedIn(): boolean {
    return this.meProtocolLoggedIn;
  }

  /**
   * Fetch user's reward balances
   */
  async fetchBalances(): Promise<RewardBalance[]> {
    try {
      const walletAddress = await this.getWalletAddress();

      if (!this.meProtocolToken) {
        throw new Error("ME Protocol token not available. Please login first.");
      }

      const balances = await this.apiClient.fetchRewardBalances(
        walletAddress,
        this.meProtocolToken
      );
      this.balances = balances;
      return balances;
    } catch (error) {
      console.error("Error fetching balances:", error);
      throw error;
    }
  }

  /**
   * Calculate swap amount for redemption
   * @param selectedRewardAddress - The contract address of the reward the user selected to use
   * @param offerDetail - The offer detail containing the reward they want to redeem for
   * @param selectedVariantId - Optional variant ID if the offer has variants
   */
  async calculateSwapAmount(
    selectedRewardAddress: string,
    offerDetail: OfferDetail,
    selectedVariantId?: string
  ): Promise<SwapAmountResponse> {
    try {
      const walletAddress = await this.getWalletAddress();

      if (!this.meProtocolToken) {
        throw new Error("ME Protocol token not available. Please login first.");
      }

      // Use provided variant ID, or first variant if available
      let variantId = selectedVariantId;
      if (
        !variantId &&
        offerDetail.offerVariants &&
        offerDetail.offerVariants.length > 0
      ) {
        variantId = offerDetail.offerVariants[0].id;
      }

      const payload = {
        walletAddress,
        inputRewardAddress: selectedRewardAddress, // The reward the user wants to use
        outPutRewardAddress: offerDetail.reward.contractAddress, // The reward from the offer
        redemptionMethodId: offerDetail.redemptionMethod.id,
        offerId: offerDetail.id,
        variantId,
        brandId: offerDetail.brand.id,
      };

      const result = await this.apiClient.fetchSwapAmount(
        payload,
        this.meProtocolToken
      );

      return result;
    } catch (error) {
      console.error("Error calculating swap amount:", error);
      throw error;
    }
  }

  /**
   * Update Magic network configuration
   */
  async updateNetwork(brandNetwork: string): Promise<void> {
    if (!this.magicClient) {
      return;
    }

    try {
      // Network configuration is already handled by env config
      // Brand network is used for Magic Link initialization
    } catch (error) {
      console.error("Error updating network:", error);
    }
  }

  /**
   * Check if user can afford the offer with selected reward
   */
  canAffordOffer(selectedReward: RewardBalance, amountNeeded: number): boolean {
    return selectedReward.balance >= amountNeeded;
  }

  /**
   * Get cached balances
   */
  getCachedBalances(): RewardBalance[] {
    return this.balances;
  }

  /**
   * Clear wallet address cache
   */
  clearCache(): void {
    this.walletAddress = null;
    this.balances = [];
  }

  /**
   * Logout - REMOVED: Users should stay logged in
   * Kept for backward compatibility but does nothing
   */
  async logout(): Promise<void> {
    // Do nothing - users stay logged in with Magic
  }
}
