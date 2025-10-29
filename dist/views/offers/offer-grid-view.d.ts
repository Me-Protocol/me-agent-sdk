/**
 * Offer Grid View
 * Renders a grid of offer cards
 */
import { Offer } from "../../types";
export declare class OfferGridView {
    /**
     * Render a grid of offers
     */
    render(offers: Offer[]): string;
    /**
     * Render a single offer card (using same styling as brand offers)
     */
    private renderOfferCard;
    /**
     * Render loading state
     */
    renderLoading(showCancelButton?: boolean): string;
}
