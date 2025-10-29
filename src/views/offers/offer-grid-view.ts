/**
 * Offer Grid View
 * Renders a grid of offer cards
 */

import { Offer } from "../../types";
import {
  calculateOfferDiscount,
  formatDiscount,
} from "../../core/utils/discount";

export class OfferGridView {
  /**
   * Render a grid of offers
   */
  render(offers: Offer[]): string {
    return `
      <div class="me-agent-offers-container">
        <div class="me-agent-offers-grid">
          ${offers.map((offer) => this.renderOfferCard(offer)).join("")}
        </div>
      </div>
    `;
  }

  /**
   * Render a single offer card (using same styling as brand offers)
   */
  private renderOfferCard(offer: Offer): string {
    const price =
      typeof offer.price === "string" ? parseFloat(offer.price) : offer.price;

    const discountedPrice = calculateOfferDiscount(
      price,
      offer.discountType,
      offer.discountDetails
    );
    const discountBadge = formatDiscount(
      offer.discountType,
      offer.discountDetails
    );

    const hasDiscount =
      typeof discountedPrice === "number" && discountedPrice < price;
    const finalPrice =
      typeof discountedPrice === "number" ? discountedPrice : price;

    return `
      <div class="me-agent-brand-offer-card" data-offer-code="${
        offer.offerCode
      }">
        <div class="me-agent-brand-offer-image-container">
          <img 
            src="${
              offer.image || "https://via.placeholder.com/200x200?text=No+Image"
            }" 
            alt="${offer.name}"
            class="me-agent-brand-offer-image"
          />
          ${
            discountBadge
              ? `<div class="me-agent-brand-offer-badge">${discountBadge}</div>`
              : ""
          }
        </div>
        <div class="me-agent-brand-offer-info">
          <h4 class="me-agent-brand-offer-name">${offer.name}</h4>
          <div class="me-agent-brand-offer-pricing">
            <span class="me-agent-brand-offer-price">$${finalPrice.toFixed(
              2
            )}</span>
            ${
              hasDiscount
                ? `<span class="me-agent-brand-offer-original-price">$${price.toFixed(
                    2
                  )}</span>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render loading state
   */
  renderLoading(showCancelButton: boolean = false): string {
    return `
      <div class="me-agent-detail-loading">
        <div class="me-agent-spinner"></div>
        ${
          showCancelButton
            ? `<button class="me-agent-cancel-loading-btn">Cancel</button>`
            : ""
        }
      </div>
    `;
  }
}
