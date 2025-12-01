/**
 * Message Parser Service
 * Extracts structured data from AI agent responses
 */

import { Offer, Brand, Category } from "../types";
import { mergeCategoriesWithPresets } from "../core/constants/categories";

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
export class MessageParser {
  /**
   * Parse raw AI response data into structured format
   */
  parseMessageData(rawData: any): ParsedMessageData {
    let offers: Offer[] = [];
    let brands: Brand[] = [];
    let categories: Category[] = [];
    let showWaysToEarn = false;

    // New format: function_response at top level
    const functionResponse =
      rawData.function_response ||
      rawData.content?.parts?.[0]?.functionResponse;
    const functionCall = rawData.content?.parts?.[0]?.functionCall;

    if (functionResponse) {
      console.log(
        "[MessageParser] Function response detected:",
        functionResponse.name
      );

      if (functionResponse.name === "query_offers") {
        const matches = functionResponse.response?.matches || [];
        console.log("[MessageParser] Parsing offers, count:", matches.length);
        offers = this.parseOffers(matches);
        console.log("[MessageParser] Parsed offers:", offers.length);
      } else if (functionResponse.name === "get_signup_earning_brands") {
        const rawBrands = functionResponse.response?.brands || [];
        brands = this.parseBrands(rawBrands);
      } else if (functionResponse.name === "get_category_purchase_earning") {
        const rawCategories = functionResponse.response?.categories || [];
        categories = mergeCategoriesWithPresets(rawCategories);
      } else if (functionResponse.name === "ways_to_earn") {
        // New format: ways_to_earn is now a function_response
        console.log("[MessageParser] Ways to earn detected");
        showWaysToEarn = true;
      }
    } else if (functionCall?.name === "ways_to_earn") {
      // Old format: ways_to_earn as function_call (keep for backwards compatibility)
      showWaysToEarn = true;
    }

    return { offers, brands, categories, showWaysToEarn };
  }

  /**
   * Parse offers from query_offers function response
   * New format:
   * [0] = id, [1] = name, [2] = offerCode, [3] = price, [4] = description,
   * [5] = available methods, [6] = discountType, [7] = discountDetails array,
   * [8] = variant title, [9] = null, [10] = null, [11] = brandName, [12] = image
   */
  private parseOffers(matches: any[]): Offer[] {
    return matches.map((match: any[]) => ({
      id: match[0] || "",
      name: match[1] || "Unnamed Offer",
      offerCode: match[2] || "",
      price: match[3] || 0,
      description: match[4] || "",
      discountType: match[6] || "",
      discountDetails: match[7] || [],
      brandName: match[11] || "Unknown Brand",
      image: match[12] || undefined,
    }));
  }

  /**
   * Parse brands from get_signup_earning_brands function response
   */
  private parseBrands(brands: any[]): Brand[] {
    return brands.map((brand: any) => ({
      id: brand.id || "",
      name: brand.name || "Unknown Brand",
      logoUrl: brand.logoUrl || null,
      description: brand.description || null,
      websiteUrl: brand.websiteUrl || null,
      shopifyStoreUrl: brand.shopifyStoreUrl || null,
      network: brand.network || "sepolia",
      categoryId: brand.categoryId || "",
      categoryName: brand.categoryName || "Unknown Category",
      rewardDetails: brand.rewardDetails || {
        earningMethodId: "",
        earningType: "sign_up",
        isActive: true,
        rewardExistingCustomers: false,
        rewardInfo: {
          id: "",
          rewardName: "",
          rewardSymbol: "",
          rewardImage: "",
          rewardValueInDollars: "0",
          rewardOriginalValue: "0",
        },
        rules: [],
      },
    }));
  }
}
