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
export class OfferService {
  private offerCache: Map<string, OfferDetail> = new Map();

  constructor(private offerAPI: OfferAPI) {}

  /**
   * Get offer details (with caching)
   */
  async getOfferDetail(
    offerCode: string,
    sessionId: string,
    useCache: boolean = true
  ): Promise<OfferDetail> {
    // Check cache first
    if (useCache && this.offerCache.has(offerCode)) {
      return this.offerCache.get(offerCode)!;
    }

    // Fetch from API
    const detail = await this.offerAPI.fetchOfferDetails(offerCode, sessionId);

    // Cache the result
    this.offerCache.set(offerCode, detail);

    return detail;
  }

  /**
   * Get offers by brand ID
   */
  async getOffersByBrandId(brandId: string, token?: string): Promise<any[]> {
    return this.offerAPI.fetchOffersByBrandId(brandId, token);
  }

  /**
   * Clear offer cache
   */
  clearCache(): void {
    this.offerCache.clear();
  }

  /**
   * Calculate final price after discount
   */
  calculateFinalPrice(
    originalPrice: string | number,
    discountPercentage: string | number
  ): number {
    const price =
      typeof originalPrice === "string"
        ? parseFloat(originalPrice)
        : originalPrice;
    const discount =
      typeof discountPercentage === "string"
        ? parseFloat(discountPercentage)
        : discountPercentage;

    return price * (1 - discount / 100);
  }
}
