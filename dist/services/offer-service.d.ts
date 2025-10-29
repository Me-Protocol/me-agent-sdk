/**
 * Offer Service
 * Business logic for offer management
 */
import { OfferDetail } from "../types";
import { OfferAPI } from "../data/api/offer-api";
/**
 * Offer Service
 * Handles offer fetching, caching, and business logic
 */
export declare class OfferService {
    private offerAPI;
    private offerCache;
    constructor(offerAPI: OfferAPI);
    /**
     * Get offer details (with caching)
     */
    getOfferDetail(offerCode: string, sessionId: string, useCache?: boolean): Promise<OfferDetail>;
    /**
     * Get offers by brand ID
     */
    getOffersByBrandId(brandId: string, token?: string): Promise<any[]>;
    /**
     * Clear offer cache
     */
    clearCache(): void;
    /**
     * Calculate final price after discount
     */
    calculateFinalPrice(originalPrice: string | number, discountPercentage: string | number): number;
}
