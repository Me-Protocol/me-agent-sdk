/**
 * Brand List View
 * Renders a list of brands with signup earning methods
 */

import { Brand } from "../../types";
import { getExternalLinkIcon } from "../shared/icons";
import { formatNumber } from "../../core/utils/formatters";

export class BrandListView {
  /**
   * Render brand list
   */
  render(brands: Brand[], origin: string): string {
    return `
      <div class="me-agent-brands-list">
        ${brands.map((brand) => this.renderBrandCard(brand, origin)).join("")}
      </div>
    `;
  }

  /**
   * Render a single brand card
   */
  private renderBrandCard(brand: Brand, origin: string): string {
    const rule = brand.rewardDetails.rules[0];
    const points = rule?.points || 0;
    const { rewardSymbol, rewardValueInDollars, rewardOriginalValue } =
      brand.rewardDetails.rewardInfo;

    const signupUrl = this.buildSignupUrl(brand, origin);
    const conversionRate = this.formatConversionRate(
      rewardSymbol,
      rewardOriginalValue,
      rewardValueInDollars
    );

    return `
      <div class="me-agent-brand-card">
        <div class="me-agent-brand-logo-container">
          <img 
            src="${
              brand.logoUrl ||
              "https://via.placeholder.com/64x64?text=" + brand.name.charAt(0)
            }" 
            alt="${brand.name}"
            class="me-agent-brand-logo"
          />
        </div>
        <div class="me-agent-brand-info">
          <h3 class="me-agent-brand-name">${brand.name}</h3>
          <p class="me-agent-brand-conversion">${conversionRate}</p>
        </div>
        <div class="me-agent-brand-actions">
          <div class="me-agent-brand-reward-amount">
            ${formatNumber(points)} <span class="me-agent-brand-reward-symbol">${rewardSymbol}</span>
          </div>
          <a 
            href="${signupUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="me-agent-brand-signup-button"
          >
            Sign Up & Earn
            ${getExternalLinkIcon({ width: 12, height: 12 })}
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Build signup URL with callback
   */
  private buildSignupUrl(brand: Brand, origin: string): string {
    const baseUrl = brand.shopifyStoreUrl || brand.websiteUrl || "";
    if (!baseUrl) return "#";

    try {
      const url = new URL(baseUrl);
      url.searchParams.append("meprotocol_callback", origin);
      return url.toString();
    } catch (error) {
      console.error("Invalid brand URL:", baseUrl);
      return baseUrl;
    }
  }

  /**
   * Format conversion rate display
   */
  private formatConversionRate(
    symbol: string,
    originalValue: string,
    dollarValue: string
  ): string {
    const value = parseFloat(dollarValue || originalValue || "0");
    return `1 ${symbol} = $${value.toFixed(2)}`;
  }
}
