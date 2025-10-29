/**
 * Message Parser Utilities
 * Handles parsing of AI agent responses and function calls
 */
import { Offer, Brand, Category } from "../types";
/**
 * Parse offers from query_offers function response
 */
export declare function parseOffers(matches: any[]): Offer[];
/**
 * Parse brands from get_signup_earning_brands function response
 */
export declare function parseBrands(brands: any[]): Brand[];
/**
 * Parse categories from get_category_purchase_earning function response
 */
export declare function parseCategories(categories: any[]): Category[];
/**
 * Detect function calls and responses in AI message
 */
export interface ParsedMessageData {
    offers: Offer[];
    brands: Brand[];
    categories: Category[];
    showWaysToEarn: boolean;
}
/**
 * Parse raw message data from AI agent stream
 */
export declare function parseMessageData(rawData: any): ParsedMessageData;
