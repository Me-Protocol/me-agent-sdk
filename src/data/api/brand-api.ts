/**
 * Brand API
 * Handles brand-related endpoints
 */

import { BaseAPI } from "./base-api";

export class BrandAPI extends BaseAPI {
  /**
   * Fetch brands by category ID with purchase earning methods
   */
  async fetchBrandsByCategoryId(categoryId: string): Promise<any[]> {
    try {
      const result = await this.get<{ data: any[] }>(
        `${this.env.API_URL}brands/earning-methods/purchase/categories/${categoryId}/brands`
      );
      return result.data || [];
    } catch (error) {
      console.error("Error fetching brands by category:", error);
      throw error;
    }
  }
}
