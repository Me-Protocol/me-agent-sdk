/**
 * Offer Detail View
 * Renders detailed offer information with variants, reviews, and actions
 */
import { OfferDetail, OfferVariant } from "../../types";
export declare class OfferDetailView {
    /**
     * Render complete offer detail page
     */
    render(detail: OfferDetail, selectedVariant: OfferVariant | null, config: {
        likedOffers?: Record<string, boolean>;
    }): string;
    /**
     * Render image carousel
     */
    private renderImageCarousel;
    /**
     * Render product information section
     */
    private renderProductInfo;
    /**
     * Render variant selector
     */
    private renderVariantSelector;
    /**
     * Render a single variant card
     */
    private renderVariantCard;
    /**
     * Render tabs (Description & Reviews)
     */
    private renderTabs;
    /**
     * Render reviews section
     */
    private renderReviews;
    /**
     * Render stars rating
     */
    private renderStars;
    /**
     * Render redemption info
     */
    private renderRedemptionInfo;
    /**
     * Render action buttons
     */
    private renderActions;
    /**
     * Calculate final price after discount
     */
    private calculateFinalPrice;
}
