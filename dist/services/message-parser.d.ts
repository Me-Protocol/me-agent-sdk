/**
 * Message Parser Service
 * Extracts structured data from AI agent responses
 */
import { Offer, Brand, Category } from "../types";
export interface ParsedMessageData {
    offers: Offer[];
    brands: Brand[];
    categories: Category[];
    showWaysToEarn: boolean;
}
/**
 * Message Parser Service
 * Handles parsing of AI agent responses and function calls/responses
 */
export declare class MessageParser {
    /**
     * Parse raw AI response data into structured format
     */
    parseMessageData(rawData: any): ParsedMessageData;
    /**
     * Parse offers from query_offers function response
     * New format:
     * [0] = id, [1] = name, [2] = offerCode, [3] = price, [4] = description,
     * [5] = available methods, [6] = discountType, [7] = discountDetails array,
     * [8] = variant title, [9] = null, [10] = null, [11] = brandName, [12] = image
     */
    private parseOffers;
    /**
     * Parse brands from get_signup_earning_brands function response
     */
    private parseBrands;
}
