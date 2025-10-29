import { Offer } from "../../types";
/**
 * Offer Preview Card - Shows in chat after AI response
 * Uses the generic CardList component
 */
export declare class OfferPreviewCard {
    /**
     * Create offer preview card element
     */
    static create(offers: Offer[], onViewOffers: (offers: Offer[]) => void): HTMLDivElement;
}
