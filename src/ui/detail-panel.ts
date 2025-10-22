import { Offer, OfferDetail, RewardBalance } from "../types";
import { RedeemManager } from "../redeem/manager";
import { OTPView } from "./components/redemption/otp-view";
import { RewardSelectionView } from "./components/redemption/reward-selection-view";
import { AffordabilityErrorView } from "./components/redemption/error-view";
import { ConfirmationView } from "./components/redemption/confirmation-view";
import { OnboardingView } from "./components/redemption/onboarding-view";
import { getCloseIcon, getChevronLeftIcon } from "./icons";

/**
 * Detail Panel Component - Handles side panel for offers, earnings, redemption, etc.
 */
export class DetailPanel {
  private element: HTMLDivElement;
  private currentView:
    | "grid"
    | "detail"
    | "otp-verify"
    | "onboarding"
    | "reward-select"
    | "confirm" = "grid";
  private offers: Offer[] = [];
  private onClose: () => void;
  private onOfferClick: (offerCode: string) => void;
  private redeemManager: RedeemManager | null = null;
  private currentOfferDetail: OfferDetail | null = null;
  private selectedVariant: any = null;
  private selectedReward: RewardBalance | null = null;
  private swapAmount: any = null;

  constructor(
    onClose: () => void,
    onOfferClick: (offerCode: string) => void,
    redeemManager?: RedeemManager
  ) {
    this.onClose = onClose;
    this.onOfferClick = onOfferClick;
    this.redeemManager = redeemManager || null;
    this.element = this.create();
  }

  /**
   * Create the offers panel element
   */
  private create(): HTMLDivElement {
    const panel = document.createElement("div");
    panel.className = "me-agent-detail-panel";
    return panel;
  }

  /**
   * Show offers grid
   */
  showGrid(offers: Offer[]): void {
    this.offers = offers;
    this.currentView = "grid";

    this.element.innerHTML = `
      <div class="me-agent-offers-header">
        <h3 class="me-agent-offers-title">Available Offers</h3>
        <button class="me-agent-offers-close" aria-label="Close offers">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-offers-grid">
        ${offers.map((offer) => this.createOfferCard(offer)).join("")}
      </div>
    `;

    // Add event listeners
    const closeBtn = this.element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", this.onClose);

    const cards = this.element.querySelectorAll(".me-agent-offer-card");
    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        this.onOfferClick(offers[index].offerCode);
      });
    });
  }

  /**
   * Create an offer card HTML
   */
  private createOfferCard(offer: Offer): string {
    const imageUrl =
      offer.image || "https://via.placeholder.com/300x200?text=No+Image";

    return `
      <div class="me-agent-offer-card" data-offer-code="${offer.offerCode}">
        <div class="me-agent-offer-image" style="background-image: url('${imageUrl}')"></div>
        <div class="me-agent-offer-info">
          <h4 class="me-agent-offer-name">${offer.name}</h4>
          <p class="me-agent-offer-brand">${offer.brandName}</p>
          <div class="me-agent-offer-price">
            <span class="me-agent-offer-discount">${offer.discountPercentage}% OFF</span>
            <span class="me-agent-offer-original-price">$${offer.price}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Show loading state
   */
  showLoading(message: string = "Loading Offer..."): void {
    this.element.innerHTML = `
      <div class="me-agent-offers-header">
        <h3 class="me-agent-offers-title">${message}</h3>
        <button class="me-agent-offers-close" aria-label="Close offers">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-offers-loading">
        <div class="me-agent-loading">
          <div class="me-agent-loading-dot"></div>
          <div class="me-agent-loading-dot"></div>
          <div class="me-agent-loading-dot"></div>
        </div>
      </div>
    `;

    const closeBtn = this.element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", this.onClose);
  }

  /**
   * Show offer details
   */
  showDetail(detail: OfferDetail): void {
    this.currentView = "detail";
    this.currentOfferDetail = detail;

    // Auto-select first variant by default
    if (detail.offerVariants && detail.offerVariants.length > 0) {
      this.selectedVariant = detail.offerVariants[0];
    }

    const mainImage =
      detail.coverImage || "https://via.placeholder.com/600x400?text=No+Image";
    const brandLogo =
      detail.brand.logo || "https://via.placeholder.com/60x60?text=Logo";

    // Render variants if available
    const variantsHtml = this.renderVariantsSelector(detail.offerVariants);

    this.element.innerHTML = `
      <div class="me-agent-offers-header">
        <button class="me-agent-offers-back" aria-label="Back to offers">
          ${getChevronLeftIcon({ width: 20, height: 20 })}
          <span>Back</span>
        </button>
        <button class="me-agent-offers-close" aria-label="Close offers">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-offer-detail">
        <div class="me-agent-offer-detail-image" style="background-image: url('${mainImage}')"></div>
        
        <div class="me-agent-offer-detail-content">
          <div class="me-agent-offer-detail-header">
            <img src="${brandLogo}" alt="${
      detail.brand.name
    }" class="me-agent-offer-brand-logo" />
            <div>
              <h3 class="me-agent-offer-detail-name">${detail.name}</h3>
              <p class="me-agent-offer-detail-brand">${detail.brand.name}</p>
            </div>
          </div>

          ${variantsHtml}

          <div class="me-agent-offer-detail-pricing">
            <div class="me-agent-offer-detail-discount">${
              detail.redemptionMethod.discountPercentage ||
              detail.redemptionMethod.discountAmount
            }${detail.redemptionMethod.discountPercentage ? "%" : "$"} OFF</div>
            <div class="me-agent-offer-detail-price">
              <span class="me-agent-offer-detail-original">$${
                detail.originalPrice
              }</span>
              <span class="me-agent-offer-detail-final">$${this.calculateFinalPrice(
                detail
              )}</span>
            </div>
          </div>

          <div class="me-agent-offer-detail-description">
            <h4>Description</h4>
            <p>${detail.description || "No description available"}</p>
          </div>

          <div class="me-agent-offer-detail-code">
            <strong>Offer Code:</strong> ${detail.offerCode}
          </div>

          <button class="me-agent-offer-claim-button">Claim Offer</button>
        </div>
      </div>
    `;

    // Add event listeners
    const backBtn = this.element.querySelector(".me-agent-offers-back");
    backBtn?.addEventListener("click", () => this.showGrid(this.offers));

    const closeBtn = this.element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", this.onClose);

    const claimBtn = this.element.querySelector(".me-agent-offer-claim-button");
    claimBtn?.addEventListener("click", () => this.handleClaimOffer());

    // Setup variant selection listeners
    this.setupVariantListeners();
  }

  /**
   * Render variants selector
   */
  private renderVariantsSelector(offerVariants?: any[]): string {
    if (!offerVariants || offerVariants.length === 0) {
      return "";
    }

    return `
      <div class="me-agent-variants-selector">
        <div class="me-agent-variants-list-horizontal">
          ${offerVariants
            .map((offerVariant, index) => {
              const variant = offerVariant.variant;
              const options = variant.options || [];
              const optionsText = options
                .map((opt: any) => opt.value)
                .join(" / ");
              const isOutOfStock = offerVariant.inventory <= 0;

              return `
              <button 
                class="me-agent-variant-chip ${index === 0 ? "active" : ""} ${
                isOutOfStock ? "out-of-stock" : ""
              }" 
                data-variant-index="${index}"
                ${isOutOfStock ? "disabled" : ""}
              >
                <span class="me-agent-variant-chip-name">${variant.name}</span>
                ${
                  optionsText
                    ? `<span class="me-agent-variant-chip-options">${optionsText}</span>`
                    : ""
                }
                ${
                  isOutOfStock
                    ? '<span class="me-agent-variant-chip-stock">Out of Stock</span>'
                    : ""
                }
              </button>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  /**
   * Setup variant selection listeners
   */
  private setupVariantListeners(): void {
    if (!this.currentOfferDetail?.offerVariants) return;

    const variantButtons = this.element.querySelectorAll(
      ".me-agent-variant-chip"
    );
    variantButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLElement;
        const index = parseInt(
          target.getAttribute("data-variant-index") || "0"
        );

        // Update active state
        variantButtons.forEach((b) => b.classList.remove("active"));
        target.classList.add("active");

        // Update selected variant
        if (this.currentOfferDetail?.offerVariants) {
          this.selectedVariant = this.currentOfferDetail.offerVariants[index];
        }
      });
    });
  }

  /**
   * Calculate final price
   */
  private calculateFinalPrice(detail: OfferDetail): string {
    const original = parseFloat(detail.originalPrice);

    if (detail.redemptionMethod.discountPercentage) {
      const discount = parseFloat(detail.redemptionMethod.discountPercentage);
      return (original * (1 - discount / 100)).toFixed(2);
    } else if (detail.redemptionMethod.discountAmount) {
      const discount = parseFloat(detail.redemptionMethod.discountAmount);
      return (original - discount).toFixed(2);
    }

    return original.toFixed(2);
  }

  /**
   * Handle claim offer button click
   */
  private async handleClaimOffer(): Promise<void> {
    if (!this.redeemManager || !this.redeemManager.isMagicConfigured()) {
      alert("Redemption is not configured. Please contact support.");
      return;
    }

    if (!this.currentOfferDetail) {
      return;
    }

    // Show loading on the claim button
    const claimBtn = this.element.querySelector(
      ".me-agent-offer-claim-button"
    ) as HTMLButtonElement;
    if (claimBtn) {
      claimBtn.disabled = true;
      claimBtn.textContent = "Processing...";
    }

    try {
      // Update Magic with brand's network if needed
      if (this.currentOfferDetail.brand.network) {
        await this.redeemManager.updateNetwork(
          this.currentOfferDetail.brand.network
        );
      }

      // Proceed to authentication check (variant already selected from horizontal list)
      await this.proceedToAuthentication();
    } catch (error) {
      console.error("Error handling claim offer:", error);
      alert("Failed to process claim. Please try again.");

      // Reset button state on error
      if (claimBtn) {
        claimBtn.disabled = false;
        claimBtn.textContent = "Claim Offer";
      }
    }
  }

  /**
   * Proceed to authentication check
   */
  private async proceedToAuthentication(): Promise<void> {
    if (!this.redeemManager) return;

    try {
      // Check if user is already authenticated
      const isAuthenticated = await this.redeemManager.isAuthenticated();

      if (isAuthenticated) {
        // Already authenticated with Magic, check ME Protocol onboarding
        await this.checkAndHandleOnboarding();
      } else {
        // Show OTP verification view
        this.showOTPView();
      }
    } catch (error) {
      console.error("Error in authentication:", error);
      alert("Failed to verify authentication. Please try again.");
    }
  }

  /**
   * Check ME Protocol login and handle accordingly
   */
  private async checkAndHandleOnboarding(): Promise<void> {
    if (!this.redeemManager) {
      return;
    }

    try {
      // Clear any cached wallet address to force refresh from Magic
      this.redeemManager.clearWalletAddressCache();

      // Check if already logged in to ME Protocol
      if (this.redeemManager.isMEProtocolLoggedIn()) {
        // Already logged in, proceed to reward selection
        await this.fetchAndShowRewardSelection();
        return;
      }

      // Show loading view and login to ME Protocol
      await this.showAndExecuteLogin();
    } catch (error) {
      console.error("Error in ME Protocol login:", error);
      alert("Failed to authenticate. Please try again.");
      if (this.currentOfferDetail) {
        this.showDetail(this.currentOfferDetail);
      }
    }
  }

  /**
   * Show loading view and execute ME Protocol login
   */
  private async showAndExecuteLogin(): Promise<void> {
    if (!this.redeemManager) {
      return;
    }

    this.currentView = "onboarding";
    this.element.innerHTML = OnboardingView.render();

    // Start login process (creates account if new user)
    await OnboardingView.startOnboarding(
      this.element,
      this.redeemManager,
      () => {
        // Login successful, proceed to reward selection
        this.fetchAndShowRewardSelection();
      },
      (error: string) => {
        // Login failed
        alert(error);
        if (this.currentOfferDetail) {
          this.showDetail(this.currentOfferDetail);
        }
      }
    );
  }

  /**
   * Show OTP verification view
   */
  private async showOTPView(): Promise<void> {
    this.currentView = "otp-verify";

    if (!this.redeemManager) return;

    const email = this.redeemManager.getEmail();
    let autoSendOTP = false;

    // Show loading while sending OTP
    if (email) {
      this.showLoading("Sending verification code...");

      try {
        await this.redeemManager.sendOTP(email);
        autoSendOTP = true;
      } catch (error) {
        console.error("Error auto-sending OTP:", error);
        // If auto-send fails, show the form
        autoSendOTP = false;
      }
    }

    this.element.innerHTML = OTPView.render(
      () => {
        if (this.currentOfferDetail) {
          this.showDetail(this.currentOfferDetail);
        }
      },
      this.onClose,
      () => this.checkAndHandleOnboarding(), // Check onboarding after OTP success
      this.redeemManager,
      autoSendOTP
    );

    OTPView.setupListeners(
      this.element,
      () => {
        if (this.currentOfferDetail) {
          this.showDetail(this.currentOfferDetail);
        }
      },
      this.onClose,
      () => this.checkAndHandleOnboarding(), // Check onboarding after OTP success
      this.redeemManager,
      autoSendOTP
    );
  }

  /**
   * Fetch balances and show reward selection
   */
  private async fetchAndShowRewardSelection(): Promise<void> {
    if (!this.redeemManager) {
      return;
    }

    try {
      this.showLoading();
      const balances = await this.redeemManager.fetchBalances();

      if (balances.length === 0) {
        alert("You don't have any rewards yet. Please earn rewards first.");
        if (this.currentOfferDetail) {
          this.showDetail(this.currentOfferDetail);
        }
        return;
      }

      this.showRewardSelection(balances);
    } catch (error) {
      console.error("Error fetching balances:", error);
      alert("Failed to fetch your rewards. Please try again.");
      if (this.currentOfferDetail) {
        this.showDetail(this.currentOfferDetail);
      }
    }
  }

  /**
   * Show reward selection view
   */
  private showRewardSelection(balances: RewardBalance[]): void {
    this.currentView = "reward-select";

    this.element.innerHTML = RewardSelectionView.render(balances);

    RewardSelectionView.setupListeners(
      this.element,
      balances,
      () => {
        if (this.currentOfferDetail) {
          this.showDetail(this.currentOfferDetail);
        }
      },
      this.onClose,
      (reward) => this.handleRewardSelect(reward)
    );
  }

  /**
   * Handle reward selection
   */
  private async handleRewardSelect(reward: RewardBalance): Promise<void> {
    if (!this.redeemManager || !this.currentOfferDetail) {
      return;
    }

    this.selectedReward = reward;

    try {
      this.showLoading();

      // Calculate swap amount with selected variant
      const swapAmount = await this.redeemManager.calculateSwapAmount(
        reward.reward.contractAddress,
        this.currentOfferDetail,
        this.selectedVariant?.id
      );

      this.swapAmount = swapAmount;

      // Check affordability
      const canAfford = this.redeemManager.canAffordOffer(
        reward,
        swapAmount.amountNeeded
      );

      if (!canAfford) {
        this.showAffordabilityError(reward, swapAmount.amountNeeded);
      } else {
        this.showConfirmation(reward, swapAmount);
      }
    } catch (error) {
      console.error("Error calculating swap amount:", error);
      alert("Failed to calculate redemption amount. Please try again.");
      this.fetchAndShowRewardSelection();
    }
  }

  /**
   * Show affordability error
   */
  private showAffordabilityError(
    reward: RewardBalance,
    amountNeeded: number
  ): void {
    this.element.innerHTML = AffordabilityErrorView.render(
      reward,
      amountNeeded
    );

    AffordabilityErrorView.setupListeners(
      this.element,
      () => this.fetchAndShowRewardSelection(),
      this.onClose
    );
  }

  /**
   * Show confirmation view
   */
  private showConfirmation(reward: RewardBalance, swapAmount: any): void {
    if (!this.currentOfferDetail) return;

    this.currentView = "confirm";

    this.element.innerHTML = ConfirmationView.render(
      reward,
      swapAmount,
      this.currentOfferDetail
    );

    ConfirmationView.setupListeners(
      this.element,
      () => this.fetchAndShowRewardSelection(),
      this.onClose,
      async () => {
        // Execute blockchain redemption transaction
        // This will be implemented when transaction logic is added
        alert("Redemption confirmed! Processing transaction...");
        this.onClose();
      }
    );
  }

  /**
   * Get the panel element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Show the panel
   */
  show(): void {
    this.element.classList.add("visible");
  }

  /**
   * Hide the panel
   */
  hide(): void {
    this.element.classList.remove("visible");
  }
}
