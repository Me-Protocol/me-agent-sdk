import { RewardBalance, OfferDetail, SwapAmountResponse } from "../../types";
import { getCloseIcon, getChevronLeftIcon } from "../shared/icons";

/**
 * Confirmation View Component
 */
export class ConfirmationView {
  /**
   * Render confirmation view
   */
  static render(
    reward: RewardBalance,
    swapAmount: SwapAmountResponse,
    offerDetail: OfferDetail
  ): string {
    return `
      <div class="me-agent-offers-header">
        <button class="me-agent-offers-back" aria-label="Back">
          ${getChevronLeftIcon({ width: 20, height: 20 })}
          <span>Back</span>
        </button>
        <h3 class="me-agent-offers-title">Confirm Redemption</h3>
        <button class="me-agent-offers-close" aria-label="Close offers">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-confirm-container">
        <div class="me-agent-confirm-summary">
          <h3>Redemption Summary</h3>
          
          <div class="me-agent-confirm-item">
            <span>Offer:</span>
            <strong>${offerDetail.name}</strong>
          </div>
          
          <div class="me-agent-confirm-item">
            <span>Reward Used:</span>
            <strong>${reward.reward.name} (${reward.reward.symbol})</strong>
          </div>
          
          <div class="me-agent-confirm-item">
            <span>Amount Required:</span>
            <strong>${swapAmount.amountNeeded.toFixed(2)} ${
      reward.reward.symbol
    }</strong>
          </div>
          
          <div class="me-agent-confirm-item">
            <span>Your Balance After:</span>
            <strong>${(reward.balance - swapAmount.amountNeeded).toFixed(2)} ${
      reward.reward.symbol
    }</strong>
          </div>
          
          <div class="me-agent-confirm-item">
            <span>You Save:</span>
            <strong class="me-agent-confirm-savings">$${swapAmount.usdDiscount.toFixed(
              2
            )}</strong>
          </div>
        </div>
        
        <button class="me-agent-confirm-button">Continue to Redemption</button>
      </div>
    `;
  }

  /**
   * Setup event listeners
   */
  static setupListeners(
    element: HTMLElement,
    onBack: () => void,
    onClose: () => void,
    onConfirm: () => void
  ): void {
    const backBtn = element.querySelector(".me-agent-offers-back");
    backBtn?.addEventListener("click", onBack);

    const closeBtn = element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", onClose);

    const confirmBtn = element.querySelector(".me-agent-confirm-button");
    confirmBtn?.addEventListener("click", onConfirm);
  }
}
