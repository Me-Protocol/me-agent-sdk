import { RewardBalance, OfferDetail, SwapAmountResponse } from "../../../types";
/**
 * Confirmation View Component
 */
export declare class ConfirmationView {
    /**
     * Render confirmation view
     */
    static render(reward: RewardBalance, swapAmount: SwapAmountResponse, offerDetail: OfferDetail): string;
    /**
     * Setup event listeners
     */
    static setupListeners(element: HTMLElement, onBack: () => void, onClose: () => void, onConfirm: () => void): void;
}
