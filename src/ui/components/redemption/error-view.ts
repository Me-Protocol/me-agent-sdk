import { RewardBalance } from "../../../types";
import { getCloseIcon, getChevronLeftIcon } from "../../icons";

/**
 * Affordability Error View Component
 */
export class AffordabilityErrorView {
  /**
   * Render error view
   */
  static render(reward: RewardBalance, amountNeeded: number): string {
    return `
      <div class="me-agent-offers-header">
        <button class="me-agent-offers-back" aria-label="Back">
          ${getChevronLeftIcon({ width: 20, height: 20 })}
          <span>Back</span>
        </button>
        <h3 class="me-agent-offers-title">Insufficient Balance</h3>
        <button class="me-agent-offers-close" aria-label="Close offers">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-error-container">
        <div class="me-agent-error-icon">⚠️</div>
        <h3>Cannot Afford This Offer</h3>
        <p>You need <strong>${amountNeeded.toFixed(2)} ${
      reward.reward.symbol
    }</strong> to redeem this offer.</p>
        <p>Your current balance: <strong>${reward.balance.toFixed(2)} ${
      reward.reward.symbol
    }</strong></p>
        <p>Please select a different reward or earn more to continue.</p>
        <button class="me-agent-error-back-button">Select Different Reward</button>
      </div>
    `;
  }

  /**
   * Setup event listeners
   */
  static setupListeners(
    element: HTMLElement,
    onBack: () => void,
    onClose: () => void
  ): void {
    const backBtn = element.querySelector(".me-agent-offers-back");
    backBtn?.addEventListener("click", onBack);

    const closeBtn = element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", onClose);

    const errorBackBtn = element.querySelector(".me-agent-error-back-button");
    errorBackBtn?.addEventListener("click", onBack);
  }
}
