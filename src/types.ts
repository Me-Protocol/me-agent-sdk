import { SupportedNetwork, Environment } from "./config/env";

/**
 * SDK Configuration options
 */
export interface MeAgentConfig {
  /** User email address (optional) */
  emailAddress?: string;
  /** Brand ID (optional) */
  brandId?: string;
  /** User ID (optional) */
  userId?: string;
  /** Button position - defaults to 'bottom-right' */
  position?: "bottom-right" | "bottom-left";
  /** Environment - defaults to 'dev' */
  environment?: Environment;
  /** Network to use - defaults to 'sepolia' */
  network?: SupportedNetwork;
  /** Callback when user clicks "Add to Cart" on offer details (optional) */
  onAddToCart?: (offer: OfferDetail) => void;
  /** Callback when user clicks share button on offer details (optional) */
  onShare?: (offer: OfferDetail) => void;
  /** Callback when user clicks like/unlike button on offer details (optional) */
  onLikeUnlike?: (offer: OfferDetail, isLiked: boolean) => void;
  /** Initial liked state for offers - map of offer IDs to liked status (optional) */
  likedOffers?: Record<string, boolean>;
}

/**
 * Message types
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * Message structure
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

/**
 * Chat state
 */
export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
}

/**
 * Session response from API
 */
export interface SessionResponse {
  id: string;
  appName: string;
  userId: string;
  state: Record<string, any>;
  events: any[];
  lastUpdateTime: number;
}

/**
 * Quick action button configuration
 */
export interface QuickAction {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

/**
 * API message payload
 */
export interface SendMessagePayload {
  appName: string;
  userId: string;
  sessionId: string;
  newMessage: {
    parts: Array<{ text: string }>;
    role: string;
  };
  streaming: boolean;
}

/**
 * Offer data structure
 */
export interface Offer {
  id: string;
  name: string;
  offerCode: string;
  price: number;
  description: string;
  discountType: string;
  discountPercentage: number;
  brandName: string;
  image?: string;
}

/**
 * Brand type for signup earning
 */
export interface Brand {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  websiteUrl: string | null;
  shopifyStoreUrl: string | null;
  network: string;
  categoryId: string;
  categoryName: string;
  rewardDetails: {
    earningMethodId: string;
    earningType: string;
    isActive: boolean;
    rewardExistingCustomers: boolean;
    rewardInfo: {
      id: string;
      rewardName: string;
      rewardSymbol: string;
      rewardImage: string;
      rewardValueInDollars: string;
      rewardOriginalValue: string;
      currency?: string;
    };
    rules: Array<{
      id: string;
      points: number;
      earningPercentage: number;
      isRepeatable: boolean;
      minimumValue: number | null;
    }>;
  };
}

/**
 * Offer variant type
 */
export interface OfferVariant {
  id: string;
  offerId: string;
  totalInventory: number;
  inventory: number;
  discountPercentage: string;
  rewardValue: string;
  offerCode: string;
  variantId: string;
  variant: {
    id: string;
    name: string;
    price: string;
    description: string | null;
    inventory: number;
    productImages: Array<{
      url: string;
    }>;
    options?: Array<{
      name: string;
      value: string;
    }>;
  };
}

/**
 * Offer detail response
 */
export interface OfferDetail {
  id: string;
  name: string;
  description: string;
  originalPrice: string;
  discountPercentage: string;
  offerCode: string;
  coverImage: string;
  brand: {
    id: string;
    name: string;
    logo: string;
    network: string;
  };
  redemptionMethod: {
    id: string;
    type: string;
    discountPercentage: string;
    discountAmount?: string;
  };
  reward: {
    id: string;
    contractAddress: string;
    rewardImage: string;
    rewardName: string;
    rewardSymbol: string;
  };
  offerImages: Array<{ url: string }>;
  offerVariants?: OfferVariant[];
}

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
