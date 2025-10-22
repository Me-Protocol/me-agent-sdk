import { Offer } from '../types';

/**
 * Offer Preview Card - Shows in chat after AI response
 */
export class OfferPreviewCard {
  /**
   * Create offer preview card element
   */
  static create(offers: Offer[], onViewOffers: (offers: Offer[]) => void): HTMLDivElement {
    const card = document.createElement('div');
    card.className = 'me-agent-offer-preview';

    // Create avatar group (show up to 3 offer images)
    const imagesToShow = offers.slice(0, 3);
    const avatarGroup = imagesToShow.map((offer, index) => {
      const imageUrl = offer.image || 'https://via.placeholder.com/40x40?text=Offer';
      return `<div class="me-agent-offer-avatar" style="background-image: url('${imageUrl}'); z-index: ${3 - index};"></div>`;
    }).join('');

    card.innerHTML = `
      <div class="me-agent-offer-preview-content">
        <div class="me-agent-offer-avatars">
          ${avatarGroup}
        </div>
        <div class="me-agent-offer-preview-text">
          <p class="me-agent-offer-preview-title">Here are some offers we found</p>
          <button class="me-agent-offer-preview-button">View offers</button>
        </div>
      </div>
    `;

    // Add event listener - pass the offers to the handler
    const button = card.querySelector('.me-agent-offer-preview-button');
    button?.addEventListener('click', () => onViewOffers(offers));

    return card;
  }
}

