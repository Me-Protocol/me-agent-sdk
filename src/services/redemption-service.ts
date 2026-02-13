/**
 * Redemption Service
 * Handles the complete offer redemption flow
 */

import { MagicClient, MagicConfig } from "../data/auth/magic-client";
import { AuthAPI } from "../data/api/auth-api";
import { RewardAPI } from "../data/api/reward-api";
import { RedemptionAPI } from "../data/api/redemption-api";
import {
  OfferDetail,
  RewardBalance,
  SwapAmountResponse,
  SwapAmountPayload,
  RedemptionOrder,
  CheckoutUrlPayload,
  OrderVerifier,
  ProcessOrderPayload,
  PushTransactionResponse,
  SpendData,
  SupportedNetwork,
} from "../types";
import { ethers } from "ethers";
import {
  same_brand_reward_redeption_magic,
  spend_reward_magic,
} from "@developeruche/runtime-sdk";
import { relay, usersServiceWithPermit } from "@developeruche/protocol-core";

export class RedemptionService {
  private magicClient: MagicClient | null = null;
  private authAPI: AuthAPI;
  private rewardAPI: RewardAPI;
  private redemptionAPI: RedemptionAPI;
  private walletAddress: string | null = null;
  private balances: RewardBalance[] = [];
  private openRewardDiamond: string;
  private meProtocolLoggedIn: boolean = false;
  private currentEmail: string | null = null;
  private meProtocolToken: string | null = null;
  private currentOrder: RedemptionOrder | null = null;
  private chainId: number;
  private rpcUrl: string;
  private runtimeUrl: string;
  private meApiKey: string;
  private apiV1Url: string;
  private gelatoApiKey: string;
  private brandId: string;

  constructor(
    authAPI: AuthAPI,
    rewardAPI: RewardAPI,
    redemptionAPI: RedemptionAPI,
    magicConfig: MagicConfig,
    openRewardDiamond: string,
    chainId: number,
    rpcUrl: string,
    runtimeUrl: string,
    meApiKey: string,
    apiV1Url: string,
    gelatoApiKey: string,
    brandId: string
  ) {
    this.authAPI = authAPI;
    this.rewardAPI = rewardAPI;
    this.redemptionAPI = redemptionAPI;
    this.magicClient = new MagicClient(magicConfig);
    this.openRewardDiamond = openRewardDiamond;
    this.chainId = chainId;
    this.rpcUrl = rpcUrl;
    this.runtimeUrl = runtimeUrl;
    this.meApiKey = meApiKey;
    this.apiV1Url = apiV1Url;
    this.gelatoApiKey = gelatoApiKey;
    this.brandId = brandId;
  }

  /**
   * Get email from stored or config
   */
  getEmail(): string | null {
    return this.currentEmail || this.authAPI.getUserEmail() || null;
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
  /**
   * Ensure user is logged in to Magic (triggers OTP if not)
   * Also verifies that the logged-in email matches the SDK email
   */
  async ensureMagicLogin(email: string): Promise<void> {
    if (!this.magicClient) {
      throw new Error("Magic is not configured");
    }

    try {
      // Check if already logged in
      const isLoggedIn = await this.magicClient.isLoggedIn();

      if (isLoggedIn) {
        // Verify the logged-in email matches the SDK email
        try {
          const metadata = await this.magicClient.getUserMetadata();
          const loggedInEmail = metadata.email?.toLowerCase().trim();
          const sdkEmail = email.toLowerCase().trim();

          if (loggedInEmail !== sdkEmail) {
            console.log(
              `🔧 Email mismatch: Logged in as "${loggedInEmail}", but SDK expects "${sdkEmail}". Logging out...`
            );
            // Logout and re-login with the correct email
            await this.magicClient.logout();
            await this.magicClient.loginWithEmailOTP(email);
          } else {
            console.log(
              `✅ Already logged in with correct email: ${loggedInEmail}`
            );
          }
        } catch (error) {
          console.error("Error verifying logged-in email:", error);
          // If we can't verify, logout and re-login to be safe
          await this.magicClient.logout();
          await this.magicClient.loginWithEmailOTP(email);
        }
      } else {
        // Not logged in, trigger Magic OTP login
        console.log(`🔐 Not logged in. Triggering Magic OTP for: ${email}`);
        await this.magicClient.loginWithEmailOTP(email);
      }
    } catch (error) {
      console.error("Error logging in to Magic:", error);
      throw new Error("Failed to login with Magic Link. Please try again.");
    }
  }

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
      const loginResponse = await this.authAPI.meProtocolLogin(
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

      const balances = await this.rewardAPI.fetchRewardBalances(
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
        // Use the underlying product variant id, not the offerVariant id
        variantId =
          offerDetail.offerVariants[0].variant?.id ||
          offerDetail.offerVariants[0].variantId ||
          undefined;
      }

      const payload: SwapAmountPayload = {
        walletAddress,
        inputRewardAddress: selectedRewardAddress, // The reward the user wants to use
        outPutRewardAddress: offerDetail.reward.contractAddress, // The reward from the offer
        redemptionMethodId: offerDetail.redemptionMethod.id,
        offerId: offerDetail.id,
        variantId,
        brandId: offerDetail.brand.id,
      };

      const result = await this.rewardAPI.fetchSwapAmount(
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
   * Execute same brand redemption transaction
   * Used when the selected reward is from the same brand as the offer
   */
  async executeSameBrandRedemption(
    rewardAddress: string,
    rewardId: string,
    amount: string,
    offerId: string,
    redemptionMethodId: string,
    brandId: string,
    variantId?: string
  ): Promise<RedemptionOrder> {
    let pushTransactionRef: PushTransactionResponse | null = null;

    try {
      if (!this.magicClient) {
        throw new Error("Magic is not configured");
      }

      if (!this.meProtocolToken) {
        throw new Error("ME Protocol token not available. Please login first.");
      }

      // Validate amount
      if (!amount || amount === "undefined" || isNaN(Number(amount))) {
        throw new Error("Invalid amount value for transaction");
      }

      console.log("Same-brand transaction params:", { amount });

      // Get Magic provider and signer
      const provider = await this.magicClient.getProvider();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const accounts = await web3Provider.listAccounts();
      const signer = web3Provider.getSigner(accounts[0]);

      console.log("SIGNER", await signer.getAddress());

      // Prepare transaction
      const rewardAmount = ethers.utils.parseEther(amount);

      // Validate all parameters
      if (!rewardAddress || rewardAddress === "undefined") {
        throw new Error(`Invalid reward address: ${rewardAddress}`);
      }
      if (!this.runtimeUrl) {
        throw new Error("Runtime URL is not configured");
      }

      console.log("same_brand_reward_redeption_magic params:", {
        rewardAddress,
        rewardAmount: rewardAmount.toString(),
        rewardAmountHex: rewardAmount.toHexString(),
        chainId: this.chainId,
        runtimeUrl: this.runtimeUrl,
        signerAddress: signer,
      });

      // Call runtime SDK
      const result = await same_brand_reward_redeption_magic(
        rewardAddress,
        rewardAmount,
        ethers.BigNumber.from(this.chainId),
        signer,
        this.runtimeUrl
      );

      console.log("RESULT", result);

      const hash = result.hash;
      console.log("FROM", result.from);

      // Push transaction to runtime
      pushTransactionRef = await this.redemptionAPI.pushTransaction(
        {
          params: {
            from: result.from,
            data: result.data,
            nonce: result.nonce,
            r: result.r,
            s: result.s,
            v: result.v,
            hash: result.hash,
          },
        },
        this.meProtocolToken
      );

      if (!pushTransactionRef) {
        throw new Error("No data returned from push transaction");
      }

      // Process order
      const order = await this.processOrder(
        pushTransactionRef.result,
        hash,
        rewardId,
        amount,
        offerId,
        redemptionMethodId,
        OrderVerifier.RUNTIME,
        variantId
      );

      return order;
    } catch (error) {
      // Refund if transaction was pushed but order processing failed
      if (pushTransactionRef?.result && this.meProtocolToken) {
        try {
          await this.redemptionAPI.refundTask(
            { spend_data: pushTransactionRef.result },
            this.meProtocolToken
          );
        } catch (refundError) {
          console.error("Error refunding task:", refundError);
        }
      }
      throw error;
    }
  }

  /**
   * Execute cross brand redemption transaction
   * Used when the selected reward is from a different brand than the offer
   */
  async executeCrossBrandRedemption(
    rewardAddress: string,
    rewardId: string,
    amount: string,
    neededAmount: string,
    brandRewardAddress: string,
    offerId: string,
    redemptionMethodId: string,
    brandId: string,
    brandNetwork: string,
    variantId?: string
  ): Promise<RedemptionOrder> {
    let pushTransactionRef: PushTransactionResponse | null = null;

    try {
      if (!this.magicClient) {
        throw new Error("Magic is not configured");
      }

      if (!this.meProtocolToken) {
        throw new Error("ME Protocol token not available. Please login first.");
      }

      if (!this.walletAddress) {
        throw new Error("Wallet address not available");
      }

      // Validate amounts
      if (
        !neededAmount ||
        neededAmount === "undefined" ||
        isNaN(Number(neededAmount))
      ) {
        throw new Error("Invalid needed amount value for transaction");
      }

      if (!amount || amount === "undefined" || isNaN(Number(amount))) {
        throw new Error("Invalid amount value for transaction");
      }

      console.log("Cross-brand transaction params:", { neededAmount, amount });

      // Get Magic provider and signer
      const provider = await this.magicClient.getProvider();
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const accounts = await web3Provider.listAccounts();
      const signer = web3Provider.getSigner(accounts[0]);

      // Prepare spend info
      const amountOfRewardAtHand = ethers.utils.parseEther(neededAmount);
      const expectedAmountOfTargetedReward = ethers.utils.parseEther(amount);

      const spendInfo = {
        rewardAtHand: rewardAddress,
        targettedReward: brandRewardAddress,
        amountOfRewardAtHand,
        expectedAmountOfTargetedReward,
      };

      console.log(
        "SPEND REWARD MAGIC",
        rewardAddress,
        amountOfRewardAtHand,
        this.openRewardDiamond,
        signer,
        this.runtimeUrl,
        spendInfo
      );

      // Call runtime SDK
      const result = await spend_reward_magic(
        rewardAddress,
        amountOfRewardAtHand,
        this.openRewardDiamond,
        ethers.BigNumber.from(this.chainId),
        signer,
        this.runtimeUrl,
        brandRewardAddress,
        expectedAmountOfTargetedReward,
      );

      // Push transaction to runtime
      pushTransactionRef = await this.redemptionAPI.pushTransaction(
        {
          params: {
            from: result.from,
            data: result.data,
            nonce: result.nonce,
            r: result.r,
            s: result.s,
            v: result.v,
            hash: result.hash,
          },
        },
        this.meProtocolToken
      );

      if (!pushTransactionRef) {
        throw new Error("No data returned from push transaction");
      }

      // Get vault permit
      const vaultParams = {
        owner: pushTransactionRef.owner,
        count: pushTransactionRef.count,
        globalHash: pushTransactionRef.globalHash,
        prefixedHash: pushTransactionRef.prefixedHash,
        r: pushTransactionRef.sig.r,
        s: pushTransactionRef.sig.s,
        v: pushTransactionRef.sig.v,
        reward: pushTransactionRef.reward,
        spender: pushTransactionRef.spender,
        value: pushTransactionRef.value,
      };

      console.log(
        "DATUM",
        spendInfo,
        vaultParams,
        this.openRewardDiamond,
        this.rpcUrl
      );

      const datum =
        await usersServiceWithPermit.spendRewardsOnAnotherBrandWithVaultPermit(
          spendInfo,
          vaultParams,
          this.openRewardDiamond,
          this.rpcUrl
        );

      if (!datum?.data) {
        throw new Error("No data returned from vault permit");
      }

      console.log(
        "RELAY",
        {
          from: this.walletAddress,
          data: datum.data,
          to: this.openRewardDiamond,
        },
        signer,
        this.meApiKey,
        this.apiV1Url,
        this.gelatoApiKey,
        this.rpcUrl,
        this.chainId,
        this.openRewardDiamond,
        brandId,
        pushTransactionRef
      );

      // Relay via Gelato
      const { taskId } = await relay(
        {
          from: this.walletAddress,
          data: datum.data,
          to: this.openRewardDiamond,
        },
        signer,
        this.meApiKey,
        this.apiV1Url,
        this.gelatoApiKey,
        this.rpcUrl,
        this.chainId,
        this.openRewardDiamond,
        brandId,
        false,
        "",
        brandNetwork === SupportedNetwork.HEDERA
      );

      // Process order
      const order = await this.processOrder(
        pushTransactionRef,
        taskId,
        rewardId,
        amount,
        offerId,
        redemptionMethodId,
        OrderVerifier.GELATO,
        variantId
      );

      return order;
    } catch (error) {
      // Refund if transaction was pushed but order processing failed
      if (pushTransactionRef?.result && this.meProtocolToken) {
        try {
          await this.redemptionAPI.refundTask(
            { spend_data: pushTransactionRef.result },
            this.meProtocolToken
          );
        } catch (refundError) {
          console.error("Error refunding task:", refundError);
        }
      }
      throw error;
    }
  }

  /**
   * Process order after successful transaction
   */
  private async processOrder(
    spendData: SpendData,
    taskId: string,
    rewardId: string,
    amount: string,
    offerId: string,
    redemptionMethodId: string,
    verifier: OrderVerifier,
    variantId?: string
  ): Promise<RedemptionOrder> {
    if (!this.meProtocolToken) {
      throw new Error("ME Protocol token not available");
    }

    const payload: ProcessOrderPayload = {
      task_id: taskId,
      reward_id: rewardId,
      target_reward_id: rewardId, // Same for now, adjust if needed
      verifier,
      spend_data: spendData,
      offer_id: offerId,
      amount,
      redemption_method_id: redemptionMethodId,
      offer_variants: variantId ? [variantId] : [],
    };

    const response = await this.redemptionAPI.processOrder(
      payload,
      this.meProtocolToken
    );

    this.currentOrder = response.order;
    return response.order;
  }

  /**
   * Get checkout URL for the redeemed offer
   */
  async getCheckoutUrl(
    brandId: string,
    productVariantIdOnBrandSite: string
  ): Promise<string> {
    if (!this.currentOrder) {
      throw new Error("No order available. Please redeem an offer first.");
    }

    if (!this.meProtocolToken) {
      throw new Error("ME Protocol token not available");
    }

    const payload: CheckoutUrlPayload = {
      brandId,
      discountCode: this.currentOrder.coupon.code,
      productVariantIdOnBrandSite,
    };

    return await this.redemptionAPI.getCheckoutUrl(
      payload,
      this.meProtocolToken
    );
  }

  /**
   * Get current order
   */
  getCurrentOrder(): RedemptionOrder | null {
    return this.currentOrder;
  }

  /**
   * Clear current order
   */
  clearCurrentOrder(): void {
    this.currentOrder = null;
  }

  /**
   * Logout - REMOVED: Users should stay logged in
   * Kept for backward compatibility but does nothing
   */
  async logout(): Promise<void> {
    // Do nothing - users stay logged in with Magic
  }
}
