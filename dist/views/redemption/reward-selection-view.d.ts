import { RewardBalance } from "../../types";
/**
 * Reward Selection View Component
 */
export declare class RewardSelectionView {
    /**
     * Render reward selection view
     */
    static render(balances: RewardBalance[]): string;
    /**
     * Render individual reward item
     */
    private static renderRewardItem;
    /**
     * Setup event listeners
     */
    static setupListeners(element: HTMLElement, balances: RewardBalance[], onBack: () => void, onClose: () => void, onSelect: (reward: RewardBalance) => void): void;
}
