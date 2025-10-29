/**
 * Redemption Types
 * All types related to reward redemption and swaps
 */

/**
 * Reward balance data
 */
export interface RewardBalance {
  reward: {
    id: string;
    contractAddress: string;
    image: string;
    name: string;
    symbol: string;
    brandId: string;
    brandNetwork: string;
    rewardDollarPrice: string;
    rewardOriginalValue: string;
  };
  balance: number;
  totalSavings: {
    totalSavingsInDollars: number;
  };
  chainId: number;
}

/**
 * Swap amount response
 */
export interface SwapAmountResponse {
  amount: number;
  amountNeeded: number;
  checkAffordability: boolean;
  usdDiscount: number;
  affordableBy: string[];
}

/**
 * Swap amount request payload
 */
export interface SwapAmountPayload {
  walletAddress: string;
  outPutRewardAddress: string;
  inputRewardAddress: string;
  redemptionMethodId: string;
  offerId: string;
  variantId?: string;
  brandId: string;
}

/**
 * ME Protocol login response (creates account if new user)
 */
export interface MELoginResponse {
  data: {
    user: {
      name: string;
      dob: string | null;
      avatar: string | null;
      referral_code: string;
      walletAddress: string;
    };
    token: string;
  };
  message: string;
  statusCode: number;
}
