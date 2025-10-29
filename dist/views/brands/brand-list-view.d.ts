/**
 * Brand List View
 * Renders a list of brands with signup earning methods
 */
import { Brand } from "../../types";
export declare class BrandListView {
    /**
     * Render brand list
     */
    render(brands: Brand[], origin: string): string;
    /**
     * Render a single brand card
     */
    private renderBrandCard;
    /**
     * Build signup URL with callback
     */
    private buildSignupUrl;
    /**
     * Format conversion rate display
     */
    private formatConversionRate;
}
