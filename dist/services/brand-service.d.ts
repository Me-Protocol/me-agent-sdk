/**
 * Brand Service
 * Business logic for brand and category management
 */
import { Brand } from "../types";
import { BrandAPI } from "../data/api/brand-api";
import { OfferAPI } from "../data/api/offer-api";
/**
 * Brand Service
 * Handles brand fetching and business logic
 */
export declare class BrandService {
    private brandAPI;
    private offerAPI;
    constructor(brandAPI: BrandAPI, offerAPI: OfferAPI);
    /**
     * Get brands by category ID
     */
    getBrandsByCategory(categoryId: string): Promise<any[]>;
    /**
     * Get brands with their offers for a category
     * Filters out brands with no offers
     */
    getBrandsWithOffers(categoryId: string, token?: string): Promise<Array<{
        brand: any;
        offers: any[];
    }>>;
    /**
     * Generate signup link for a brand
     */
    generateSignupLink(brand: Brand, callbackUrl: string): string;
    /**
     * Format conversion rate display
     */
    formatConversionRate(brand: Brand): string;
    /**
     * Get reward amount display text
     */
    getRewardAmountText(brand: Brand): string;
}
