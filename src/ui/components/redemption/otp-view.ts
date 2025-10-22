import { RedeemManager } from "../../../redeem/manager";
import { getCloseIcon, getChevronLeftIcon } from "../../icons";

/**
 * OTP Verification View Component
 */
export class OTPView {
  /**
   * Render OTP verification view
   */
  static render(
    onBack: () => void,
    onClose: () => void,
    onSuccess: () => void,
    redeemManager: RedeemManager,
    autoSendOTP: boolean = false
  ): string {
    const configEmail = redeemManager.getEmail() || "";
    const isEmailPreFilled = !!configEmail;

    return `
      <div class="me-agent-offers-header">
        <button class="me-agent-offers-back" aria-label="Back">
          ${getChevronLeftIcon({ width: 20, height: 20 })}
          <span>Back</span>
        </button>
        <h3 class="me-agent-offers-title">Verify Email</h3>
        <button class="me-agent-offers-close" aria-label="Close offers">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-otp-container">
        <p class="me-agent-otp-description">${
          autoSendOTP
            ? "Please check your email for the one-time password we just sent."
            : "We'll send a one-time password to your email to verify your identity."
        }</p>
        
        <div class="me-agent-otp-form" style="${
          autoSendOTP ? "display: none;" : ""
        }">
          <input 
            type="email" 
            class="me-agent-otp-email-input" 
            placeholder="Enter your email address"
            value="${configEmail}"
            ${isEmailPreFilled ? "readonly" : ""}
            required
          />
          <button class="me-agent-otp-send-button">Send OTP</button>
        </div>

        <div class="me-agent-otp-status" style="display: ${
          autoSendOTP ? "block" : "none"
        };">${
      autoSendOTP
        ? "OTP sent! Please check your email and complete verification."
        : ""
    }</div>
      </div>
    `;
  }

  /**
   * Setup event listeners for OTP view
   */
  static setupListeners(
    element: HTMLElement,
    onBack: () => void,
    onClose: () => void,
    onSuccess: () => void,
    redeemManager: RedeemManager,
    autoSendOTP: boolean = false
  ): void {
    const backBtn = element.querySelector(".me-agent-offers-back");
    backBtn?.addEventListener("click", onBack);

    const closeBtn = element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", onClose);

    const emailInput = element.querySelector(
      ".me-agent-otp-email-input"
    ) as HTMLInputElement;
    const sendBtn = element.querySelector(
      ".me-agent-otp-send-button"
    ) as HTMLButtonElement;
    const statusDiv = element.querySelector(
      ".me-agent-otp-status"
    ) as HTMLDivElement;

    // If auto-send is enabled, start polling for authentication immediately
    if (autoSendOTP) {
      this.startAuthPolling(redeemManager, onSuccess);
      return;
    }

    // Manual OTP send
    if (sendBtn) {
      sendBtn.addEventListener("click", async () => {
        const email = emailInput?.value.trim();
        if (!email) {
          this.showStatus(
            statusDiv,
            "Please enter a valid email address",
            "error"
          );
          return;
        }

        try {
          sendBtn.disabled = true;
          sendBtn.textContent = "Sending...";
          statusDiv.style.display = "none";

          await redeemManager.sendOTP(email);
          this.showStatus(
            statusDiv,
            "OTP sent! Please check your email and complete verification.",
            "success"
          );

          // Start polling for authentication
          this.startAuthPolling(redeemManager, onSuccess);
        } catch (error: any) {
          console.error("Error sending OTP:", error);
          this.showStatus(
            statusDiv,
            error.message || "Failed to send OTP. Please try again.",
            "error"
          );
          sendBtn.disabled = false;
          sendBtn.textContent = "Send OTP";
        }
      });
    }
  }

  /**
   * Start polling for authentication status
   */
  private static startAuthPolling(
    redeemManager: RedeemManager,
    onSuccess: () => void
  ): void {
    const pollInterval = setInterval(async () => {
      try {
        const isAuthenticated = await redeemManager.isAuthenticated();
        if (isAuthenticated) {
          clearInterval(pollInterval);
          onSuccess();
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 300000);
  }

  /**
   * Show status message
   */
  private static showStatus(
    element: HTMLDivElement,
    message: string,
    type: "success" | "error"
  ): void {
    element.textContent = message;
    element.className = `me-agent-otp-status me-agent-otp-status-${type}`;
    element.style.display = "block";
  }
}
