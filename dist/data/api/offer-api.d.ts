/**
 * Offer API
 * Handles offer-related endpoints
 */
import { BaseAPI } from "./base-api";
import { OfferDetail } from "../../types";
export declare class OfferAPI extends BaseAPI {
    /**
     * Fetch detailed information about a specific offer
     */
    fetchOfferDetails(offerCode: string, sessionId: string): Promise<OfferDetail>;
    /**
     * Fetch offers by brand ID
     */
    fetchOffersByBrandId(brandId: string, token?: string): Promise<any[]>;
}
