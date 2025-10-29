/**
 * Brand Offers View
 * Renders brands with their horizontal offer lists
 */

import {
  calculateOfferDiscount,
  formatDiscount,
} from "../../core/utils/discount";
import { getChevronRightIcon } from "../shared/icons";

export class BrandOffersView {
  /**
   * Render brands with offers
   */
  render(brandsWithOffers: Array<{ brand: any; offers: any[] }>): string {
    if (brandsWithOffers.length === 0) {
      return this.renderEmptyState();
    }

    return `
      <div class="me-agent-brands-offers-list">
        ${brandsWithOffers
          .map((item) => this.renderBrandWithOffers(item))
          .join("")}
      </div>
    `;
  }

  /**
   * Render a brand with its offers
   */
  private renderBrandWithOffers(item: { brand: any; offers: any[] }): string {
    const { brand, offers } = item;
    const rule = brand.rewardDetails?.rules?.[0];
    const earningInfo = rule
      ? `Earn ${rule.earningPercentage}% back in ${brand.rewardDetails.rewardInfo.rewardSymbol}`
      : "Earn rewards";

    const displayedOffers = offers.slice(0, 4);
    const hasMore = offers.length > 4;

    return `
      <div class="me-agent-brand-offers-section" data-brand-id="${brand.id}">
        <div class="me-agent-brand-offers-header">
          <div class="me-agent-brand-offers-info">
            <img 
              src="${
                brand.logoUrl ||
                "https://via.placeholder.com/60x60?text=" + brand.name.charAt(0)
              }" 
              alt="${brand.name}"
              class="me-agent-brand-offers-logo"
            />
            <h3 class="me-agent-brand-offers-name">${brand.name}</h3>
          </div>
          <div class="me-agent-brand-earning-amount">${earningInfo}</div>
        </div>
        <div class="me-agent-brand-offers-grid">
          ${displayedOffers
            .map((offer) => this.renderOfferCard(offer))
            .join("")}
        </div>
        ${
          hasMore
            ? `<button class="me-agent-view-all-offers-btn" data-brand-name="${
                brand.name
              }">
                View All
                ${getChevronRightIcon({ width: 16, height: 16 })}
              </button>`
            : ""
        }
      </div>
    `;
  }

  /**
   * Render a single offer card
   */
  private renderOfferCard(offer: any): string {
    const price = parseFloat(offer.price || offer.originalPrice || "0");

    const discountedPrice = calculateOfferDiscount(
      price,
      offer.discountType || "",
      offer.discountDetails || []
    );
    const discountBadge = formatDiscount(
      offer.discountType || "",
      offer.discountDetails || []
    );

    const hasDiscount =
      typeof discountedPrice === "number" && discountedPrice < price;
    const finalPrice =
      typeof discountedPrice === "number" ? discountedPrice : price;

    // Get product URL from nested product object and ensure it has a protocol
    let productUrl = offer.product?.productUrl || "#";

    // Add https:// if the URL doesn't start with http:// or https://
    if (
      productUrl !== "#" &&
      !productUrl.startsWith("http://") &&
      !productUrl.startsWith("https://")
    ) {
      productUrl = `https://${productUrl}`;
    }

    return `
      <div 
        class="me-agent-brand-offer-card" 
        data-product-url="${productUrl}"
      >
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
   * Render all offers for a single brand in a grid
   */
  renderBrandOffersGrid(offers: any[]): string {
    return `
      <div class="me-agent-brand-all-offers-grid">
        ${offers.map((offer) => this.renderOfferCard(offer)).join("")}
      </div>
    `;
  }

  /**
   * Render empty state
   */
  private renderEmptyState(): string {
    return `
      <div class="me-agent-empty-state">
        <p>No offers available at this time.</p>
      </div>
    `;
  }
}
