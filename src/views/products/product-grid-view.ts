/**
 * Product Grid View
 * Renders a grid of product cards from query_products function response
 */

import { Product } from "../../types";

export class ProductGridView {
  /**
   * Render product grid
   */
  render(products: Product[]): string {
    if (!products || products.length === 0) {
      return `<div class="me-agent-products-empty">No products found</div>`;
    }

    return `
      <div class="me-agent-products-container">
        <div class="me-agent-products-grid">
          ${products.map((product) => this.renderProductCard(product)).join("")}
        </div>
      </div>
    `;
  }

  /**
   * Render individual product card
   */
  private renderProductCard(product: Product): string {
    const discount = this.getDiscountBadge(product.discounts);
    const finalPrice = this.calculateFinalPrice(
      product.price,
      product.discounts
    );

    // Clean up product URL if it has https:// prefix
    const productUrl = product.productUrl.startsWith("http")
      ? product.productUrl
      : `https://${product.productUrl}`;

    return `
      <div class="me-agent-product-card" data-product-id="${product.product_id}">
        <div class="me-agent-product-image-container">
          ${discount ? `<div class="me-agent-product-discount-badge">${discount}</div>` : ""}
          <img
            src="${product.coverImage}"
            alt="${product.product_name}"
            class="me-agent-product-image"
            loading="lazy"
          />
        </div>
        <div class="me-agent-product-info">
          <div class="me-agent-product-brand">${product.brand_name}</div>
          <h4 class="me-agent-product-name">${product.product_name}</h4>
          <div class="me-agent-product-pricing">
            ${
              finalPrice < product.price
                ? `
              <span class="me-agent-product-original-price">$${(product.price / 100).toFixed(2)}</span>
              <span class="me-agent-product-final-price">$${(finalPrice / 100).toFixed(2)}</span>
            `
                : `<span class="me-agent-product-price">$${(product.price / 100).toFixed(2)}</span>`
            }
          </div>
          <a href="${productUrl}" target="_blank" rel="noopener noreferrer" class="me-agent-product-cta-button">
            View Product
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Get discount badge text
   */
  private getDiscountBadge(discounts: any[]): string | null {
    if (!discounts || discounts.length === 0) return null;

    const discount = discounts[0];
    if (discount.percentage) {
      return `${discount.percentage}% OFF`;
    }
    if (discount.amount) {
      return `$${(discount.amount / 100).toFixed(0)} OFF`;
    }
    return null;
  }

  /**
   * Calculate final price after discount
   */
  private calculateFinalPrice(price: number, discounts: any[]): number {
    if (!discounts || discounts.length === 0) return price;

    const discount = discounts[0];
    if (discount.percentage) {
      return price * (1 - discount.percentage / 100);
    }
    if (discount.amount) {
      return Math.max(0, price - discount.amount);
    }
    return price;
  }
}

