import { RewardBalance } from "../../types";
/**
 * Affordability Error View Component
 */
export declare class AffordabilityErrorView {
    /**
     * Render error view
     */
    static render(reward: RewardBalance, amountNeeded: number): string;
    /**
     * Setup event listeners
     */
    static setupListeners(element: HTMLElement, onBack: () => void, onClose: () => void): void;
}
