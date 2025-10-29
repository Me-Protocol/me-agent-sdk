/**
 * Offer API
 * Handles offer-related endpoints
 */

import { BaseAPI } from "./base-api";
import { OfferDetail } from "../../types";

export class OfferAPI extends BaseAPI {
  /**
   * Fetch detailed information about a specific offer
   */
  async fetchOfferDetails(
    offerCode: string,
    sessionId: string
  ): Promise<OfferDetail> {
    try {
      const result = await this.get<{ data: OfferDetail }>(
        `${this.env.API_V1_URL}store/offer/${offerCode}?sessionId=${sessionId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching offer details:", error);
      throw error;
    }
  }

  /**
   * Fetch offers by brand ID
   */
  async fetchOffersByBrandId(brandId: string, token?: string): Promise<any[]> {
    try {
      const headers: Record<string, string> = {};

      if (token) {
        headers["authorization"] = `Bearer ${token}`;
      }

      const result = await this.get<{ data: { offers: any[] } }>(
        `${this.env.API_V1_URL}store/offer?page=1&limit=50&brandId=${brandId}`,
        headers
      );

      return result.data?.offers || [];
    } catch (error) {
      console.error("Error fetching offers by brand:", error);
      throw error;
    }
  }
}
