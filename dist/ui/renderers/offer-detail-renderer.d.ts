/**
 * Offer Detail Renderer
 * Handles rendering of detailed offer views including variants and reviews
 */
import { OfferDetail, OfferVariant } from "../../types";
/**
 * Calculate final price after discount
 */
export declare function calculateFinalPrice(detail: OfferDetail): string;
/**
 * Render variant selector
 */
export declare function renderVariantSelector(offerVariants?: OfferVariant[]): string;
/**
 * Render dummy reviews (placeholder for future real reviews)
 */
export declare function renderReviews(): string;
