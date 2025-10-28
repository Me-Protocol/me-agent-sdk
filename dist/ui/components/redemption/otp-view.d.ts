import { RedeemManager } from "../../../redeem/manager";
/**
 * OTP Verification View Component
 */
export declare class OTPView {
    /**
     * Render OTP verification view
     */
    static render(onBack: () => void, onClose: () => void, onSuccess: () => void, redeemManager: RedeemManager, autoSendOTP?: boolean): string;
    /**
     * Setup event listeners for OTP view
     */
    static setupListeners(element: HTMLElement, onBack: () => void, onClose: () => void, onSuccess: () => void, redeemManager: RedeemManager, autoSendOTP?: boolean): void;
    /**
     * Start polling for authentication status
     */
    private static startAuthPolling;
    /**
     * Show status message
     */
    private static showStatus;
}
