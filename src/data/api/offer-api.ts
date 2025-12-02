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

  /**
   * Fetch offers by category ID
   */
  async fetchOffersByCategoryId(
    categoryId: string,
    token?: string
  ): Promise<any[]> {
    try {
      const headers: Record<string, string> = {};

      if (token) {
        headers["authorization"] = `Bearer ${token}`;
      }

      const result = await this.get<{ data: { offers: any[] } }>(
        `${this.env.API_V1_URL}store/offer?page=1&limit=50&categoryId=${categoryId}`,
        headers
      );

      const rawOffers = result.data?.offers || [];
      console.log("[OfferAPI] Raw offers from API:", rawOffers.length);

      // Map API response to match expected offer structure
      return rawOffers.map((apiOffer: any) => {
        // Extract redemption method details
        const redemptionMethod = apiOffer.redemptionMethod || {};
        const redemptionType = redemptionMethod.type || "";
        const redemptionDiscount = redemptionMethod.discountPercentage || "";
        const redemptionAmount = redemptionMethod.discountAmount || "";

        // Parse discount details from redemption method
        const discountDetails = [];
        if (redemptionType === "FIXED_PERCENTAGE_OFF" && redemptionDiscount) {
          discountDetails.push({
            percentage: parseFloat(redemptionDiscount),
          });
        } else if (redemptionType === "FIXED_AMOUNT_OFF" && redemptionAmount) {
          discountDetails.push({
            amount: parseFloat(redemptionAmount),
          });
        }

        console.log("[OfferAPI] Mapped offer discount:", {
          offerName: apiOffer.offerName,
          redemptionType,
          redemptionDiscount,
          redemptionAmount,
          discountDetails,
        });

        return {
          id: apiOffer.offerId || apiOffer.id || "",
          name: apiOffer.offerName || apiOffer.name || "Unnamed Offer",
          offerCode: apiOffer.offerCode || "",
          price: parseFloat(
            apiOffer.offerPrice ||
              apiOffer.price ||
              apiOffer.originalPrice ||
              "0"
          ),
          originalPrice:
            apiOffer.offerPrice ||
            apiOffer.originalPrice ||
            apiOffer.price ||
            "0",
          description: apiOffer.offerDescription || apiOffer.description || "",
          discountType: redemptionType,
          discountDetails: discountDetails,
          discountPercentage: redemptionDiscount,
          discountAmount: redemptionAmount,
          brandName:
            apiOffer.brandDetails?.brandName ||
            apiOffer.brandName ||
            "Unknown Brand",
          image: apiOffer.offerImage || apiOffer.image || undefined,
          coverImage:
            apiOffer.offerImage ||
            apiOffer.coverImage ||
            apiOffer.image ||
            undefined,
          websiteUrl:
            apiOffer.brandDetails?.websiteUrl ||
            apiOffer.websiteUrl ||
            undefined,
          productUrl: apiOffer.productUrl || undefined,
          product: apiOffer.product || undefined,
        };
      });
    } catch (error) {
      console.error("Error fetching offers by category:", error);
      throw error;
    }
  }
}
