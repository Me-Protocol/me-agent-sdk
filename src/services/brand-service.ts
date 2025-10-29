/**
 * Brand Service
 * Business logic for brand and category management
 */

import { Brand, Category } from "../types";
import { BrandAPI } from "../data/api/brand-api";
import { OfferAPI } from "../data/api/offer-api";

/**
 * Brand Service
 * Handles brand fetching and business logic
 */
export class BrandService {
  constructor(private brandAPI: BrandAPI, private offerAPI: OfferAPI) {}

  /**
   * Get brands by category ID
   */
  async getBrandsByCategory(categoryId: string): Promise<any[]> {
    return this.brandAPI.fetchBrandsByCategoryId(categoryId);
  }

  /**
   * Get brands with their offers for a category
   * Filters out brands with no offers
   */
  async getBrandsWithOffers(
    categoryId: string,
    token?: string
  ): Promise<Array<{ brand: any; offers: any[] }>> {
    // Fetch all brands for the category
    const brands = await this.brandAPI.fetchBrandsByCategoryId(categoryId);

    // Fetch offers for each brand in parallel
    const brandsWithOffers = await Promise.all(
      brands.map(async (brand) => {
        try {
          const offers = await this.offerAPI.fetchOffersByBrandId(
            brand.id,
            token
          );
          return { brand, offers };
        } catch (error) {
          console.error(`Error fetching offers for brand ${brand.id}:`, error);
          return { brand, offers: [] };
        }
      })
    );

    // Filter out brands with no offers
    return brandsWithOffers.filter((item) => item.offers.length > 0);
  }

  /**
   * Generate signup link for a brand
   */
  generateSignupLink(brand: Brand, callbackUrl: string): string {
    const baseUrl = brand.shopifyStoreUrl || brand.websiteUrl || "";
    if (!baseUrl) return "#";

    const url = new URL(baseUrl);
    url.searchParams.append("meprotocol_callback", callbackUrl);
    return url.toString();
  }

  /**
   * Format conversion rate display
   */
  formatConversionRate(brand: Brand): string {
    const { rewardSymbol, rewardValueInDollars } =
      brand.rewardDetails.rewardInfo;
    const dollars = parseFloat(rewardValueInDollars || "0");
    return `1 ${rewardSymbol} = $${dollars.toFixed(2)}`;
  }

  /**
   * Get reward amount display text
   */
  getRewardAmountText(brand: Brand): string {
    const rule = brand.rewardDetails.rules[0];
    if (!rule) return "N/A";

    const { points } = rule;
    const { rewardSymbol } = brand.rewardDetails.rewardInfo;

    return `${points.toLocaleString()} ${rewardSymbol}`;
  }
}
