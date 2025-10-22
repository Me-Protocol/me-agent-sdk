import { RedeemManager } from "../../../redeem/manager";

/**
 * Loading View Component
 * Shows a loading state while user is being authenticated to ME Protocol
 */
export class OnboardingView {
  /**
   * Render loading view
   */
  static render(): string {
    return `
      <div class="me-agent-offers-header">
        <h3 class="me-agent-offers-title">Please wait</h3>
      </div>
      <div class="me-agent-onboarding-container">
        <div class="me-agent-onboarding-spinner"></div>
        <h3 class="me-agent-onboarding-title">Setting up your account...</h3>
        <p class="me-agent-onboarding-description">
          This will only take a moment.
        </p>
        <div class="me-agent-onboarding-status">Please wait...</div>
      </div>
    `;
  }

  /**
   * Start login process
   */
  static async startOnboarding(
    element: HTMLElement,
    redeemManager: RedeemManager,
    onSuccess: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    const statusDiv = element.querySelector(
      ".me-agent-onboarding-status"
    ) as HTMLDivElement;

    try {
      if (statusDiv) {
        statusDiv.textContent = "Authenticating...";
      }

      // Login to ME Protocol (creates account if new user)
      await redeemManager.loginToMEProtocol();

      if (statusDiv) {
        statusDiv.textContent = "Almost done...";
      }

      // Small delay to show success
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      onError(error.message || "Failed to authenticate. Please try again.");
    }
  }
}
