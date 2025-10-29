/**
 * Brand API
 * Handles brand-related endpoints
 */
import { BaseAPI } from "./base-api";
export declare class BrandAPI extends BaseAPI {
    /**
     * Fetch brands by category ID with purchase earning methods
     */
    fetchBrandsByCategoryId(categoryId: string): Promise<any[]>;
}
