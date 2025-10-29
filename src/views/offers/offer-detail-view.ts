/**
 * Offer Detail View
 * Renders detailed offer information with variants, reviews, and actions
 */

import { OfferDetail, OfferVariant } from "../../types";
import { formatNumber } from "../../core/utils/formatters";

export class OfferDetailView {
  /**
   * Render complete offer detail page
   */
  render(
    detail: OfferDetail,
    selectedVariant: OfferVariant | null,
    quantity: number,
    config: { likedOffers?: Record<string, boolean> }
  ): string {
    const currentVariant = selectedVariant || detail.offerVariants?.[0] || null;
    const variantData = currentVariant?.variant;
    const finalPrice = this.calculateFinalPrice(detail, currentVariant);

    return `
      <div class="me-agent-offer-detail-scroll">
        ${this.renderImageCarousel(detail, variantData)}
        ${this.renderProductInfo(detail, currentVariant, finalPrice)}
        ${this.renderVariantSelector(detail.offerVariants)}
        ${this.renderQuantitySelector(quantity)}
        ${this.renderTabs(detail)}
        ${this.renderRedemptionInfo(detail)}
      </div>
      ${this.renderActions(detail, config.likedOffers?.[detail.id])}
    `;
  }

  /**
   * Render image carousel
   */
  private renderImageCarousel(detail: OfferDetail, variantData?: any): string {
    const images = variantData?.productImages || detail.offerImages || [];
    const primaryImage = images[0]?.url || detail.coverImage;

    return `
      <div class="me-agent-image-carousel">
        <img 
          src="${primaryImage}" 
          alt="${detail.name}"
          class="me-agent-carousel-image"
        />
      </div>
    `;
  }

  /**
   * Render product information section
   */
  private renderProductInfo(
    detail: OfferDetail,
    currentVariant: OfferVariant | null,
    finalPrice: number
  ): string {
    const originalPrice = currentVariant
      ? parseFloat(currentVariant.variant.price)
      : parseFloat(detail.originalPrice);
    const discount = currentVariant
      ? parseFloat(currentVariant.discountPercentage)
      : parseFloat(detail.discountPercentage);
    
    const variantName = currentVariant?.variant.name || "Default";
    const redemptionType = detail.redemptionMethod?.type || "";
    const isFreeShipping = redemptionType === "FREE_SHIPPING";

    return `
      <div class="me-agent-detail-info">
        <h2 class="me-agent-detail-title">${detail.name}${variantName !== "Default" ? ` - ${variantName}` : ""}</h2>
        <div class="me-agent-detail-pricing">
          ${
            isFreeShipping
              ? `<div class="me-agent-price-main">$${originalPrice.toFixed(2)}</div>`
              : `
                <div class="me-agent-price-main">$${finalPrice.toFixed(2)}</div>
                ${
                  discount > 0
                    ? `<div class="me-agent-price-original">$${originalPrice.toFixed(2)}</div>`
                    : ""
                }
              `
          }
        </div>
        ${
          discount > 0 || isFreeShipping
            ? `<div class="me-agent-discount-badge">${
                isFreeShipping
                  ? "Free Shipping"
                  : `${Math.round(discount)}% Off With Coupon`
              }</div>`
            : ""
        }
        <div class="me-agent-detail-shipping">Ships To Texas, United State Of America</div>
      </div>
    `;
  }

  /**
   * Render variant selector
   */
  private renderVariantSelector(offerVariants?: OfferVariant[]): string {
    if (!offerVariants || offerVariants.length === 0) return "";

    return `
      <div class="me-agent-variant-section">
        <label class="me-agent-section-label">Variant</label>
        <div class="me-agent-variant-grid">
          ${offerVariants
            .map((variant, index) =>
              this.renderVariantCard(variant, index === 0)
            )
            .join("")}
        </div>
      </div>
    `;
  }

  /**
   * Render a single variant card
   */
  private renderVariantCard(
    variant: OfferVariant,
    isSelected: boolean
  ): string {
    const variantImage = variant.variant.productImages?.[0]?.url || "";
    const discount = parseFloat(variant.discountPercentage);

    return `
      <div class="me-agent-variant-card ${
        isSelected ? "selected" : ""
      }" data-variant-id="${variant.id}">
        <div class="me-agent-variant-image-wrapper">
          ${
            variantImage
              ? `<img src="${variantImage}" alt="${variant.variant.name}" class="me-agent-variant-image" />`
              : `<div class="me-agent-variant-placeholder"></div>`
          }
          ${
            discount > 0
              ? `<div class="me-agent-variant-badge">
                  <span class="me-agent-variant-badge-icon">🔥</span>
                  <span class="me-agent-variant-badge-text">${Math.round(discount)}% Off</span>
                </div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  /**
   * Render quantity selector
   */
  private renderQuantitySelector(quantity: number): string {
    return `
      <div class="me-agent-quantity-section">
        <label class="me-agent-section-label">Quantity</label>
        <div class="me-agent-quantity-selector">
          <button class="me-agent-quantity-btn" data-action="decrease">-</button>
          <input 
            type="number" 
            class="me-agent-quantity-input" 
            value="${quantity}" 
            min="1" 
            max="10"
            readonly
          />
          <button class="me-agent-quantity-btn" data-action="increase">+</button>
        </div>
      </div>
    `;
  }

  /**
   * Render tabs (Description & Reviews)
   */
  private renderTabs(detail: OfferDetail): string {
    return `
      <div class="me-agent-tabs">
        <button class="me-agent-tab active" data-tab="description">Description</button>
        <button class="me-agent-tab" data-tab="reviews">Reviews</button>
      </div>
      <div class="me-agent-tab-content">
        <div class="me-agent-tab-pane active" data-pane="description">
          <p class="me-agent-description-text">${
            detail.description || "No description available."
          }</p>
        </div>
        <div class="me-agent-tab-pane" data-pane="reviews">
          ${this.renderReviews()}
        </div>
      </div>
    `;
  }

  /**
   * Render reviews section
   */
  private renderReviews(): string {
    const dummyReviews = [
      {
        name: "Sarah M.",
        rating: 5,
        text: "Absolutely love this product! The quality exceeded my expectations and it arrived quickly.",
      },
      {
        name: "James T.",
        rating: 4,
        text: "Great value for money. Would recommend to anyone looking for a reliable option.",
      },
      {
        name: "Emily R.",
        rating: 5,
        text: "Perfect! Exactly what I was looking for. Will definitely purchase again.",
      },
    ];

    const avgRating = 4.7;
    const totalReviews = dummyReviews.length;

    return `
      <div class="me-agent-reviews">
        <div class="me-agent-reviews-summary">
          <div class="me-agent-reviews-score">
            <div class="me-agent-score-number">${avgRating.toFixed(1)}</div>
            <div class="me-agent-stars-large">${this.renderStars(
              avgRating,
              20
            )}</div>
            <div class="me-agent-review-count">${formatNumber(
              totalReviews
            )} reviews</div>
          </div>
          <div class="me-agent-reviews-bars">
            ${[5, 4, 3, 2, 1]
              .map(
                (stars) => `
              <div class="me-agent-rating-row">
                <span class="me-agent-stars-small">${this.renderStars(
                  stars,
                  12
                )}</span>
                <div class="me-agent-rating-bar">
                  <div class="me-agent-rating-fill" style="width: ${
                    stars === 5 ? 70 : stars === 4 ? 20 : 10
                  }%"></div>
                </div>
                <span class="me-agent-rating-count">${
                  stars === 5 ? 2 : stars === 4 ? 1 : 0
                }</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        <div class="me-agent-reviews-list">
          ${dummyReviews
            .map(
              (review) => `
            <div class="me-agent-review-item">
              <div class="me-agent-review-header">
                <div class="me-agent-reviewer-avatar">${review.name.charAt(
                  0
                )}</div>
                <div>
                  <div class="me-agent-reviewer-name">${review.name}</div>
                  <div class="me-agent-review-stars">${this.renderStars(
                    review.rating,
                    14
                  )}</div>
                </div>
              </div>
              <p class="me-agent-review-text">${review.text}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  /**
   * Render stars rating
   */
  private renderStars(rating: number, size: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const star = (fill: string) => `
      <svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="${fill}">
        <path d="M10 1L12.5 7.5H19L14 11.5L16 18L10 14L4 18L6 11.5L1 7.5H7.5L10 1Z"/>
      </svg>
    `;

    return `
      ${"★".repeat(fullStars)}
      ${hasHalfStar ? "½" : ""}
      ${"☆".repeat(emptyStars)}
    `.trim();
  }

  /**
   * Render redemption info
   */
  private renderRedemptionInfo(detail: OfferDetail): string {
    return `
      <div class="me-agent-redemption-info">
        <h3>Redeem with ${detail.reward.rewardSymbol}</h3>
        <p>Use your ${detail.reward.rewardName} rewards to get this offer</p>
      </div>
    `;
  }

  /**
   * Render action buttons
   */
  private renderActions(detail: OfferDetail, isLiked: boolean = false): string {
    return `
      <div class="me-agent-detail-actions">
        <button class="me-agent-redeem-button" data-action="redeem">
          Redeem Now
        </button>
        <div class="me-agent-secondary-actions">
          <button class="me-agent-action-button" data-action="like" data-liked="${isLiked}">
            <span class="me-agent-action-icon">${isLiked ? "❤️" : "♡"}</span>
          </button>
          <button class="me-agent-action-button" data-action="share">
            <span class="me-agent-action-icon">↗</span>
          </button>
          <button class="me-agent-action-button" data-action="add-to-cart">
            <span class="me-agent-action-icon">🛒</span>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Calculate final price after discount
   */
  private calculateFinalPrice(
    detail: OfferDetail,
    currentVariant: OfferVariant | null
  ): number {
    const price = currentVariant
      ? parseFloat(currentVariant.variant.price)
      : parseFloat(detail.originalPrice);
    const discount = currentVariant
      ? parseFloat(currentVariant.discountPercentage)
      : parseFloat(detail.discountPercentage);

    return price * (1 - discount / 100);
  }
}
