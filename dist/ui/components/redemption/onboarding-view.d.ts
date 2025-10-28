import { RedeemManager } from "../../../redeem/manager";
/**
 * Loading View Component
 * Shows a loading state while user is being authenticated to ME Protocol
 */
export declare class OnboardingView {
    /**
     * Render loading view
     */
    static render(): string;
    /**
     * Start login process
     */
    static startOnboarding(element: HTMLElement, redeemManager: RedeemManager, onSuccess: () => void, onError: (error: string) => void): Promise<void>;
}
