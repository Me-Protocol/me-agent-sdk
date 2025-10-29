/**
 * Brand Offers View
 * Renders brands with their horizontal offer lists
 */
export declare class BrandOffersView {
    /**
     * Render brands with offers
     */
    render(brandsWithOffers: Array<{
        brand: any;
        offers: any[];
    }>): string;
    /**
     * Render a brand with its offers
     */
    private renderBrandWithOffers;
    /**
     * Render a single offer card
     */
    private renderOfferCard;
    /**
     * Render empty state
     */
    private renderEmptyState;
}
