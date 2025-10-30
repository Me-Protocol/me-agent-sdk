/**
 * Redemption View
 * Renders the redemption flow UI (Review, Processing, Complete steps)
 */

import { OfferDetail, RewardBalance, RedemptionOrder, RedemptionMethodType } from "../../types";
import { getDiscountedPrice, RedemptionMethodInput } from "../../core/utils/discount";

export class RedemptionView {
  /**
   * Render review step (show offer, selected reward, amount needed)
   */
  renderReviewStep(
    offerDetail: OfferDetail,
    selectedReward: RewardBalance,
    swapAmount: { amount: number; amountNeeded: number; checkAffordability: boolean },
    selectedVariant?: any
  ): string {
    const variantName = selectedVariant ? selectedVariant.variant.name : "Default";
    const originalPrice = selectedVariant
      ? parseFloat(selectedVariant.variant.price)
      : parseFloat(offerDetail.originalPrice);
    const finalPrice = getDiscountedPrice(originalPrice, offerDetail.redemptionMethod as any as RedemptionMethodInput);
    const isAffordable = selectedReward.balance >= swapAmount.amountNeeded;

    return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-step-indicator">
          <div class="me-agent-step active">Review</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step">Processing</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step">Complete</div>
        </div>

        <div class="me-agent-redemption-content">
          <div class="me-agent-offer-summary-card">
            <img src="${offerDetail.coverImage}" alt="${offerDetail.name}" class="me-agent-offer-summary-image" />
            <div class="me-agent-offer-summary-details">
              <h3 class="me-agent-offer-summary-title">${offerDetail.name}${variantName !== "Default" ? ` - ${variantName}` : ""}</h3>
              <div class="me-agent-offer-summary-price">
                <span class="me-agent-price-final">$${typeof finalPrice === "number" ? finalPrice.toFixed(2) : finalPrice}</span>
                ${typeof finalPrice === "number" ? `<span class="me-agent-price-original">$${originalPrice.toFixed(2)}</span>` : ""}
              </div>
            </div>
            <div class="me-agent-offer-summary-discount">
              ${Math.round(parseFloat(offerDetail.discountPercentage))}% OFF
            </div>
          </div>

          <div class="me-agent-reward-selection">
            <label class="me-agent-section-label">Pay With</label>
            <div class="me-agent-selected-reward-card">
              <img src="${selectedReward.reward.image}" alt="${selectedReward.reward.name}" class="me-agent-reward-icon" />
              <div class="me-agent-reward-info">
                <div class="me-agent-reward-name">${selectedReward.reward.name}</div>
                <div class="me-agent-reward-balance">Balance: ${selectedReward.balance.toFixed(2)} ${selectedReward.reward.symbol}</div>
              </div>
              <div class="me-agent-reward-amount">
                <div class="me-agent-amount-needed">${swapAmount.amountNeeded.toFixed(2)} ${selectedReward.reward.symbol}</div>
              </div>
            </div>
            ${!isAffordable ? `
              <div class="me-agent-error-message">
                Insufficient balance. You need ${swapAmount.amountNeeded.toFixed(2)} ${selectedReward.reward.symbol} but only have ${selectedReward.balance.toFixed(2)}.
              </div>
            ` : ""}
            <button class="me-agent-change-reward-btn">Use another reward</button>
          </div>

          <button class="me-agent-redeem-btn" ${!isAffordable ? "disabled" : ""}>
            Redeem Offer
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render processing step (show loading during transaction)
   */
  renderProcessingStep(offerDetail: OfferDetail): string {
    return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-step-indicator">
          <div class="me-agent-step completed">Review</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step active">Processing</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step">Complete</div>
        </div>

        <div class="me-agent-redemption-content">
          <div class="me-agent-processing-animation">
            <div class="me-agent-spinner"></div>
            <h3>Processing your redemption...</h3>
            <p>Please wait while we complete your transaction. This may take a few moments.</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render complete step (show success message and checkout button)
   */
  renderCompleteStep(order: RedemptionOrder, offerDetail: OfferDetail): string {
    return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-step-indicator">
          <div class="me-agent-step completed">Review</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step completed">Processing</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step active">Complete</div>
        </div>

        <div class="me-agent-redemption-content">
          <div class="me-agent-success-animation">
            <div class="me-agent-success-icon">✓</div>
            <h3>Redemption Successful!</h3>
            <p>Thank you for redeeming. Your redemption details have been sent to your email.</p>
          </div>

          <div class="me-agent-coupon-details-card">
            <div class="me-agent-coupon-label">Your Discount Code</div>
            <div class="me-agent-coupon-code">
              <span class="me-agent-coupon-code-text">${order.coupon.code}</span>
              <button class="me-agent-copy-coupon-btn" data-code="${order.coupon.code}">Copy</button>
            </div>
            <div class="me-agent-coupon-discount">
              ${order.coupon.discountValue || "Discount applied"}
            </div>
          </div>

          <button class="me-agent-use-coupon-btn" data-order-id="${order.id}">
            Use Coupon
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render error state
   */
  renderError(error: string): string {
    return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-error-state">
          <div class="me-agent-error-icon">✕</div>
          <h3>Redemption Failed</h3>
          <p>${error}</p>
          <button class="me-agent-try-again-btn">Try Again</button>
        </div>
      </div>
    `;
  }

  /**
   * Render loading state (when fetching data)
   */
  renderLoading(): string {
    return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-loading-state">
          <div class="me-agent-spinner"></div>
          <p>Loading redemption details...</p>
        </div>
      </div>
    `;
  }

  /**
   * Render reward selection list (for "Use another reward" modal)
   */
  renderRewardList(rewards: RewardBalance[], currentRewardId: string): string {
    return `
      <div class="me-agent-reward-list">
        <h3 class="me-agent-reward-list-title">Select a reward</h3>
        <div class="me-agent-reward-list-items">
          ${rewards
            .map(
              (reward) => `
            <div class="me-agent-reward-list-item ${reward.reward.id === currentRewardId ? "selected" : ""}" data-reward-id="${reward.reward.id}">
              <img src="${reward.reward.image}" alt="${reward.reward.name}" class="me-agent-reward-list-icon" />
              <div class="me-agent-reward-list-info">
                <div class="me-agent-reward-list-name">${reward.reward.name}</div>
                <div class="me-agent-reward-list-balance">Balance: ${reward.balance.toFixed(2)} ${reward.reward.symbol}</div>
              </div>
              <div class="me-agent-reward-list-check">✓</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
}

