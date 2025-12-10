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
  private renderOfferCard(offer: any): string {
    // Handle both mapped API response and regular Offer type
    const price = parseFloat(offer.price || offer.originalPrice || "0");

    // Debug logging
    console.log("[OfferGridView] Rendering offer:", {
      name: offer.name,
      price,
      discountType: offer.discountType,
      discountDetails: offer.discountDetails,
      discountPercentage: offer.discountPercentage,
      discountAmount: offer.discountAmount,
    });

    const discountedPrice = calculateOfferDiscount(
      price,
      offer.discountType || "",
      offer.discountDetails || []
    );
    const discountBadge = formatDiscount(
      offer.discountType || "",
      offer.discountDetails || []
    );

    console.log("[OfferGridView] Calculated:", {
      discountedPrice,
      discountBadge,
    });

    // Check if it's free shipping
    const isFreeShipping = discountedPrice === "Free shipping";
    const hasDiscount =
      isFreeShipping ||
      (typeof discountedPrice === "number" && discountedPrice < price);

    return `
      <div class="me-agent-brand-offer-card" data-offer-code="${
        offer.offerCode
      }">
        <div class="me-agent-brand-offer-image-container">
          <img 
            src="${
              offer.coverImage ||
              offer.image ||
              "https://via.placeholder.com/200x200?text=No+Image"
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
            ${
              isFreeShipping
                ? `<span class="me-agent-brand-offer-original-price">$${price.toFixed(
                    2
                  )}</span>
                   <span class="me-agent-brand-offer-price">Free Shipping</span>`
                : `<span class="me-agent-brand-offer-price">$${
                    typeof discountedPrice === "number"
                      ? discountedPrice.toFixed(2)
                      : price.toFixed(2)
                  }</span>
                   ${
                     hasDiscount
                       ? `<span class="me-agent-brand-offer-original-price">$${price.toFixed(
                           2
                         )}</span>`
                       : ""
                   }`
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

  /**
   * Render empty state when no offers are found
   */
  renderEmptyState(): string {
    return `
      <div class="me-agent-error-container">
        <div class="me-agent-error-icon">📦</div>
        <h3>No Offers Found</h3>
        <p>There are currently no offers available in this category. Check back later for new deals!</p>
        <button class="me-agent-error-back-button">Go Back</button>
      </div>
    `;
  }
}
