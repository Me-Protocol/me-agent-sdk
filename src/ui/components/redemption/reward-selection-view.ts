import { RewardBalance } from "../../../types";
import { getCloseIcon, getChevronLeftIcon } from "../../icons";

/**
 * Reward Selection View Component
 */
export class RewardSelectionView {
  /**
   * Render reward selection view
   */
  static render(balances: RewardBalance[]): string {
    return `
      <div class="me-agent-offers-header">
        <button class="me-agent-offers-back" aria-label="Back">
          ${getChevronLeftIcon({ width: 20, height: 20 })}
          <span>Back</span>
        </button>
        <h3 class="me-agent-offers-title">Select Reward</h3>
        <button class="me-agent-offers-close" aria-label="Close offers">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-rewards-container">
        <p class="me-agent-rewards-description">Choose a reward to redeem this offer:</p>
        
        <div class="me-agent-rewards-list">
          ${balances
            .map((balance, index) => this.renderRewardItem(balance, index))
            .join("")}
        </div>
      </div>
    `;
  }

  /**
   * Render individual reward item
   */
  private static renderRewardItem(
    balance: RewardBalance,
    index: number
  ): string {
    const imageUrl =
      balance.reward.image || "https://via.placeholder.com/60x60?text=Reward";

    return `
      <div class="me-agent-reward-item" data-index="${index}">
        <div class="me-agent-reward-image" style="background-image: url('${imageUrl}')"></div>
        <div class="me-agent-reward-info">
          <h4 class="me-agent-reward-name">${balance.reward.name}</h4>
          <p class="me-agent-reward-symbol">${balance.reward.symbol}</p>
          <p class="me-agent-reward-balance">Balance: ${balance.balance.toLocaleString()}</p>
        </div>
        <button class="me-agent-reward-select-button">Select</button>
      </div>
    `;
  }

  /**
   * Setup event listeners
   */
  static setupListeners(
    element: HTMLElement,
    balances: RewardBalance[],
    onBack: () => void,
    onClose: () => void,
    onSelect: (reward: RewardBalance) => void
  ): void {
    const backBtn = element.querySelector(".me-agent-offers-back");
    backBtn?.addEventListener("click", onBack);

    const closeBtn = element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", onClose);

    const selectButtons = element.querySelectorAll(
      ".me-agent-reward-select-button"
    );
    selectButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => onSelect(balances[index]));
    });
  }
}
