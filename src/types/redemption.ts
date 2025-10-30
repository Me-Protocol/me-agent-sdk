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

/**
 * Transaction signature
 */
export interface TransactionSignature {
  r: string;
  s: string;
  v: number;
}

/**
 * Send transaction data (from Magic signing)
 */
export interface SendTransactionData {
  from: string;
  nonce: string;
  data: string;
  r: string;
  s: string;
  v: string;
  hash: string;
}

/**
 * Spend data returned from runtime
 */
export interface SpendData {
  owner: string;
  count: string;
  globalHash: string;
  prefixedHash: string;
  sig: TransactionSignature;
  reward: string;
  spender: string;
  value: string;
}

/**
 * Order verifier type
 */
export enum OrderVerifier {
  GELATO = "gelato",
  RUNTIME = "runtime",
}

/**
 * Runtime task status
 */
export enum TaskStatus {
  SUCCEEDED = "SUCCEDDED",
  PROCESSING = "PROCESSING",
  FAILED = "FAILED",
  ABANDONED = "ABANDONED",
  INCOMPLETE = "INCOMPLETE",
  PENDING = "PENDING",
  FULFILLED = "FULLFILLED",
  CANCELLED = "CANCELLED",
}

/**
 * Runtime task response
 */
export interface RuntimeTask {
  verifier: OrderVerifier;
  task_id: string;
  reward_id: string;
  status: TaskStatus;
  spend_data: SpendData;
}

/**
 * Process order payload
 */
export interface ProcessOrderPayload {
  task_id: string;
  reward_id: string;
  target_reward_id: string;
  verifier: OrderVerifier;
  spend_data: SpendData;
  offer_id: string;
  amount: string;
  redemption_method_id: string;
  offer_variants: string[];
}

/**
 * Order coupon
 */
export interface Coupon {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  isUsed: boolean;
  isExpired: boolean;
  offerId: string;
  userId: string;
  expiryDate: string;
  expiryReminderSent: boolean;
  order_code: string;
  brandDiscountId: string;
  brandPriceRuleId: string;
  reminderRetryCount: number;
  discountValue: string;
}

/**
 * Redemption order
 */
export interface RedemptionOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  orderCode: string;
  offerVariantId: string;
  brandId: string;
  points: string;
  quantity: number;
  isRedeemed: boolean;
  couponId: string;
  taskId: string;
  status: string;
  isRefunded: boolean;
  failedReason: string;
  paymentType: string;
  verifier: string;
  spendData: SpendData;
  redeemRewardId: string;
  retries: number;
  jobId: string;
  redemptionMethodId: string;
  coupon: Coupon;
}

/**
 * Process order response
 */
export interface ProcessOrderResponse {
  task: RuntimeTask;
  order: RedemptionOrder;
}

/**
 * Checkout URL payload
 */
export interface CheckoutUrlPayload {
  brandId: string;
  discountCode: string;
  productVariantIdOnBrandSite: string;
}

/**
 * Checkout URL response
 */
export interface CheckoutUrlResponse {
  url: string;
}

/**
 * Refund task payload
 */
export interface RefundTaskPayload {
  spend_data: SpendData;
}

/**
 * Push transaction payload
 */
export interface PushTransactionPayload {
  params: SendTransactionData;
}

/**
 * Push transaction response
 */
export interface PushTransactionResponse extends SpendData {
  result: SpendData;
}
