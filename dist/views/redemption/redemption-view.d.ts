/**
 * Redemption View
 * Renders the redemption flow UI (Review, Processing, Complete steps)
 */
import { OfferDetail, RewardBalance, RedemptionOrder } from "../../types";
export declare class RedemptionView {
    /**
     * Render review step (show offer, selected reward, amount needed)
     */
    renderReviewStep(offerDetail: OfferDetail, selectedReward: RewardBalance, swapAmount: {
        amount: number;
        amountNeeded: number;
        checkAffordability: boolean;
    }, selectedVariant?: any): string;
    /**
     * Render processing step (show loading during transaction)
     */
    renderProcessingStep(offerDetail: OfferDetail): string;
    /**
     * Render complete step (show success message and checkout button)
     */
    renderCompleteStep(order: RedemptionOrder, offerDetail: OfferDetail): string;
    /**
     * Render error state
     */
    renderError(error: string): string;
    /**
     * Render loading state (when fetching data)
     */
    renderLoading(): string;
    /**
     * Render reward selection list (for "Use another reward" modal)
     */
    renderRewardList(rewards: RewardBalance[], currentRewardId: string): string;
}
