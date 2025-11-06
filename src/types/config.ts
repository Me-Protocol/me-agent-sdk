import { SupportedNetwork, Environment } from "../core/config/env";
import { OfferDetail } from "./offer";

/**
 * SDK Configuration options
 */
export interface MeAgentConfig {
  /** User email address (optional) */
  emailAddress?: string;
  /** Brand ID (optional) */
  brandId?: string;
  /** User ID (required) */
  userId: string;
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
  /** Enable dev mode shortcuts (defaults to false) */
  devMode?: boolean;
}
