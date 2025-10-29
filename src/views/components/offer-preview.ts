import { Offer } from "../../types";
import { CardList, CardListItem } from "./card-list";

/**
 * Offer Preview Card - Shows in chat after AI response
 * Uses the generic CardList component
 */
export class OfferPreviewCard {
  /**
   * Create offer preview card element
   */
  static create(
    offers: Offer[],
    onViewOffers: (offers: Offer[]) => void
  ): HTMLDivElement {
    // Convert offers to card list items
    const items: CardListItem[] = offers.map((offer) => ({
      id: offer.offerCode || offer.id,
      image: offer.image,
      title: offer.name,
      subtitle: offer.brandName,
    }));

    // Use the generic CardList component
    return CardList.create({
      items,
      title: `Here are ${offers.length} ${
        offers.length === 1 ? "offer" : "offers"
      } we found for you`,
      actionLabel: "View offers",
      onAction: () => onViewOffers(offers),
    });
  }
}
