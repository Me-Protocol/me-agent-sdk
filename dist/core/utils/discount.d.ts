/**
 * Discount Utility
 * Calculates discounted prices based on redemption method
 */
import { RedemptionMethodType, DiscountDetails } from "../../types/offer";
export interface RedemptionMethodInput {
    type: RedemptionMethodType;
    discountPercentage?: number;
    discountAmount?: number;
    maxDiscountAmount?: number;
}
/**
 * Calculate the final discounted price based on redemption method
 */
export declare function getDiscountedPrice(originalPrice: number, method: RedemptionMethodInput): number | string;
/**
 * Calculate discount from offer data (from query_offers response)
 */
export declare function calculateOfferDiscount(originalPrice: number, discountType: string, discountDetails: DiscountDetails[]): number | string;
/**
 * Format discount for display
 */
export declare function formatDiscount(discountType: string, discountDetails: DiscountDetails[]): string;
