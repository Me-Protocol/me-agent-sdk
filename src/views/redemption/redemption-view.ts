/**
 * Redemption View
 * Renders the redemption flow UI (Review, Processing, Complete steps)
 */

import {
  OfferDetail,
  RewardBalance,
  RedemptionOrder,
  RedemptionMethodType,
} from "../../types";
import {
  getDiscountedPrice,
  RedemptionMethodInput,
} from "../../core/utils/discount";

export class RedemptionView {
  /**
   * Render review step (show offer, selected reward, amount needed)
   */
  renderReviewStep(
    offerDetail: OfferDetail,
    selectedReward: RewardBalance,
    swapAmount: {
      amount: number;
      amountNeeded: number;
      checkAffordability: boolean;
    },
    selectedVariant?: any
  ): string {
    const variantName = selectedVariant
      ? selectedVariant.variant.name
      : "Default";
    const originalPrice = selectedVariant
      ? parseFloat(selectedVariant.variant.price)
      : parseFloat(offerDetail.originalPrice);
    const finalPrice = getDiscountedPrice(
      originalPrice,
      offerDetail.redemptionMethod as any as RedemptionMethodInput
    );
    const isAffordable = selectedReward.balance >= swapAmount.amountNeeded;

    // Calculate discount percentage for display
    let discountDisplay = "";
    const redemptionMethod = offerDetail.redemptionMethod;
    if (redemptionMethod) {
      if (redemptionMethod.type === "FREE_SHIPPING") {
        discountDisplay = "FREE SHIPPING";
      } else if (
        redemptionMethod.discountPercentage &&
        parseFloat(redemptionMethod.discountPercentage) > 0
      ) {
        discountDisplay = `${Math.round(
          parseFloat(redemptionMethod.discountPercentage)
        )}% OFF`;
      } else if (
        redemptionMethod.discountAmount &&
        parseFloat(redemptionMethod.discountAmount) > 0
      ) {
        discountDisplay = `$${parseFloat(
          redemptionMethod.discountAmount
        ).toFixed(0)} OFF`;
      } else if (
        selectedVariant?.discountPercentage &&
        parseFloat(selectedVariant.discountPercentage) > 0
      ) {
        discountDisplay = `${Math.round(
          parseFloat(selectedVariant.discountPercentage)
        )}% OFF`;
      } else {
        // Calculate percentage from prices
        const discount =
          ((originalPrice -
            (typeof finalPrice === "number" ? finalPrice : originalPrice)) /
            originalPrice) *
          100;
        discountDisplay = discount > 0 ? `${Math.round(discount)}% OFF` : "";
      }
    } else if (
      selectedVariant?.discountPercentage &&
      parseFloat(selectedVariant.discountPercentage) > 0
    ) {
      discountDisplay = `${Math.round(
        parseFloat(selectedVariant.discountPercentage)
      )}% OFF`;
    } else if (
      offerDetail.discountPercentage &&
      parseFloat(offerDetail.discountPercentage) > 0
    ) {
      discountDisplay = `${Math.round(
        parseFloat(offerDetail.discountPercentage)
      )}% OFF`;
    }

    return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-redemption-header">
          <p class="me-agent-redemption-subtitle">You are about to redeem this offer</p>
        </div>

        <div class="me-agent-step-indicator">
          <div class="me-agent-step-item active completed">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Review</div>
          </div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step-item">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Processing</div>
          </div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step-item">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Complete</div>
          </div>
        </div>

        <div class="me-agent-redemption-content">
          <div class="me-agent-offer-summary-card">
            <img src="${offerDetail.coverImage}" alt="${
      offerDetail.name
    }" class="me-agent-offer-summary-image" />
              <div class="me-agent-offer-summary-details">
                <h3 class="me-agent-offer-summary-title">${offerDetail.name}${
      variantName !== "Default" ? ` - ${variantName}` : ""
    }</h3>
                <div class="me-agent-offer-summary-price">
                  ${
                    finalPrice === "Free shipping"
                      ? `<span class="me-agent-price-final">Free Shipping</span>
                      <span class="me-agent-price-original">$${originalPrice.toFixed(
                        2
                      )}</span>`
                      : `<span class="me-agent-price-final">$${
                          typeof finalPrice === "number"
                            ? finalPrice.toFixed(2)
                            : originalPrice.toFixed(2)
                        }</span>
                      ${
                        typeof finalPrice === "number" &&
                        finalPrice < originalPrice
                          ? `<span class="me-agent-price-original">$${originalPrice.toFixed(
                              2
                            )}</span>`
                          : ""
                      }`
                  }
                </div>
              </div>
              <div class="me-agent-offer-summary-right">
                ${
                  discountDisplay
                    ? `<div class="me-agent-offer-summary-discount">${discountDisplay}</div>`
                    : ""
                }
                <div class="me-agent-offer-amount-needed">${swapAmount.amountNeeded.toFixed(
                  2
                )} ${selectedReward.reward.symbol} Needed</div>
              </div>
            </div>

            <div class="me-agent-reward-selection">
              <div class="me-agent-selected-reward-card">
                <img src="${selectedReward.reward.image}" alt="${
      selectedReward.reward.name
    }" class="me-agent-reward-icon" />
                <div class="me-agent-reward-info">
                  <div class="me-agent-reward-balance">${selectedReward.balance.toFixed(
                    2
                  )} <span class="me-agent-reward-symbol">${
      selectedReward.reward.symbol
    }</span></div>
                  <div class="me-agent-reward-name">${
                    selectedReward.reward.name
                  }</div>
                </div>
                <div class="me-agent-reward-amount">
                  <div class="me-agent-amount-needed">
                    ${swapAmount.amountNeeded.toFixed(2)} ${
      selectedReward.reward.symbol
    } Needed
                    <span class="me-agent-status-dot ${
                      isAffordable ? "success" : "error"
                    }"></span>
                  </div>
                </div>
              </div>
              ${
                !isAffordable
                  ? `
                    <div class="me-agent-error-message">
                      Insufficient balance. You need ${swapAmount.amountNeeded.toFixed(
                        2
                      )} ${
                      selectedReward.reward.symbol
                    } but only have ${selectedReward.balance.toFixed(2)}.
                    </div>
                  `
                  : ""
              }
              <button class="me-agent-change-reward-btn">Use Another Reward</button>
            </div> 
          </div> 
      </div>
      <div class="me-agent-redeem-btn-container">
        <button class="me-agent-redeem-btn" ${!isAffordable ? "disabled" : ""}>
          Redeem Offer
        </button>
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
          <div class="me-agent-step-item completed">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Review</div>
          </div>
          <div class="me-agent-step-line completed"></div>
          <div class="me-agent-step-item active completed">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Processing</div>
          </div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step-item">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Complete</div>
          </div>
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
          <div class="me-agent-step-item completed">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Review</div>
          </div>
          <div class="me-agent-step-line completed"></div>
          <div class="me-agent-step-item completed">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Processing</div>
          </div>
          <div class="me-agent-step-line completed"></div>
          <div class="me-agent-step-item active completed">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Complete</div>
          </div>
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
              <span class="me-agent-coupon-code-text">${
                order.coupon.code
              }</span>
              <button class="me-agent-copy-coupon-btn" data-code="${
                order.coupon.code
              }">Copy</button>
            </div>
            <div class="me-agent-coupon-discount">
              ${order.coupon.discountValue || "Discount applied"}
            </div>
          </div>

          <button class="me-agent-use-coupon-btn">
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
   * Render reward selection list (for bottom sheet)
   */
  renderRewardList(rewards: RewardBalance[], currentRewardId: string): string {
    return `
      <div class="me-agent-reward-list-items">
        ${rewards
          .map(
            (reward) => `
          <div class="me-agent-reward-list-item ${
            reward.reward.id === currentRewardId ? "selected" : ""
          }" data-reward-id="${reward.reward.id}">
            <img src="${reward.reward.image}" alt="${
              reward.reward.name
            }" class="me-agent-reward-list-icon" />
            <div class="me-agent-reward-list-info">
              <div class="me-agent-reward-list-name">${reward.reward.name}</div>
              <div class="me-agent-reward-list-balance">Balance: ${reward.balance.toFixed(
                2
              )} ${reward.reward.symbol}</div>
            </div>
            <div class="me-agent-reward-list-check">✓</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
}
