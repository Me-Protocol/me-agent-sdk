import {
  Offer,
  OfferDetail,
  OfferVariant,
  RewardBalance,
  SwapAmountResponse,
  MeAgentConfig,
} from "../types";
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
  private selectedVariant: OfferVariant | null = null;
  private selectedReward: RewardBalance | null = null;
  private swapAmount: SwapAmountResponse | null = null;
  private config: MeAgentConfig;
  private likedOffers: Record<string, boolean> = {};

  constructor(
    onClose: () => void,
    onOfferClick: (offerCode: string) => void,
    config: MeAgentConfig,
    redeemManager?: RedeemManager
  ) {
    this.onClose = onClose;
    this.onOfferClick = onOfferClick;
    this.config = config;
    this.likedOffers = config.likedOffers || {};
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

    const discountedPrice = (
      offer.price *
      (1 - offer.discountPercentage / 100)
    ).toFixed(2);

    return `
      <div class="me-agent-offer-card" data-offer-code="${offer.offerCode}">
        <div class="me-agent-offer-image-container">
          <div class="me-agent-offer-image" style="background-image: url('${imageUrl}')"></div>
          <span class="me-agent-offer-badge">${
            offer.discountPercentage
          }% Off</span>
        </div>
        <div class="me-agent-offer-info">
          <h4 class="me-agent-offer-name">${offer.name}</h4>
          <div class="me-agent-offer-pricing">
            <span class="me-agent-offer-price">$${discountedPrice}</span>
            <span class="me-agent-offer-original-price">$${offer.price.toFixed(
              2
            )}</span>
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
   * Render header with back button
   */
  private renderHeader(backText: string = "Back"): string {
    return `
      <div class="me-agent-offers-header">
        <button class="me-agent-offers-back" aria-label="Back">
          ${getChevronLeftIcon({ width: 20, height: 20 })}
          <span>${backText}</span>
        </button>
        <button class="me-agent-offers-close" aria-label="Close">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
    `;
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

    const finalPrice = this.calculateFinalPrice(detail);
    const discountPercentage =
      detail.redemptionMethod.discountPercentage || "20";
    const isLiked = this.likedOffers[detail.id] || false;

    // Prepare images for carousel
    const images =
      detail.offerImages?.length > 0
        ? detail.offerImages.map((img) => img.url)
        : [
            detail.coverImage ||
              "https://via.placeholder.com/600x400?text=No+Image",
          ];

    // Render variants if available
    const variantsHtml = this.renderVariantSelector(detail.offerVariants);

    // Action buttons
    const hasCallbacks = !!(
      this.config.onAddToCart ||
      this.config.onShare ||
      this.config.onLikeUnlike
    );
    const actionButtonsHtml = hasCallbacks
      ? `
      ${
        this.config.onAddToCart
          ? '<button class="me-agent-action-button me-agent-add-to-cart">Add To Cart</button>'
          : ""
      }
      ${
        this.config.onLikeUnlike
          ? `<button class="me-agent-action-icon ${
              isLiked ? "liked" : ""
            }" data-action="like">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${
          isLiked ? "currentColor" : "none"
        }" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>`
          : ""
      }
      ${
        this.config.onShare
          ? `<button class="me-agent-action-icon" data-action="share">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
      </button>`
          : ""
      }
    `
      : "";

    this.element.innerHTML = `
      ${this.renderHeader("Product details")}
      <div class="me-agent-offer-detail">
        <div class="me-agent-offer-detail-scroll">
          <!-- Image Carousel -->
          <div class="me-agent-image-carousel">
            ${images
              .map(
                (img, i) => `
              <div class="me-agent-carousel-image ${
                i === 0 ? "active" : ""
              }" style="background-image: url('${img}')"></div>
            `
              )
              .join("")}
          </div>

          <!-- Product Info -->
          <div class="me-agent-detail-info">
            <h3 class="me-agent-detail-title">${detail.name}${
      this.selectedVariant ? ` - ${this.selectedVariant.variant.name}` : ""
    }</h3>
            
            <div class="me-agent-detail-pricing">
              <span class="me-agent-detail-price">$${finalPrice}</span>
              <span class="me-agent-detail-original-price">$${
                detail.originalPrice
              }</span>
            </div>

            <div class="me-agent-detail-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              ${discountPercentage}% Off With Coupon
            </div>

            <p class="me-agent-detail-shipping">Ships To Texas, United State Of America</p>

            ${variantsHtml}

            <!-- Quantity Selector -->
            <div class="me-agent-quantity-section">
              <label class="me-agent-section-label">Quantity</label>
              <div class="me-agent-quantity-selector">
                <button class="me-agent-quantity-btn" data-action="decrease">−</button>
                <input type="number" class="me-agent-quantity-input" value="0" min="0" />
                <button class="me-agent-quantity-btn" data-action="increase">+</button>
              </div>
            </div>

            <!-- Description & Reviews Tabs -->
            <div class="me-agent-tabs">
              <button class="me-agent-tab active" data-tab="description">Description</button>
              <button class="me-agent-tab" data-tab="reviews">Reviews</button>
            </div>

            <div class="me-agent-tab-content">
              <div class="me-agent-tab-pane active" data-pane="description">
                <p class="me-agent-description-text">${
                  detail.description || "No description available"
                }</p>
              </div>
              <div class="me-agent-tab-pane" data-pane="reviews">
                ${this.renderReviews()}
              </div>
            </div>
          </div>

          <!-- Redemption Info -->
          <div class="me-agent-redemption-info">
            <p>Redeem this offer to get a unique coupon code, then enter the code on checkout and the discount will be applied to your total before payment.</p>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="me-agent-detail-actions">
          <button class="me-agent-redeem-button">Redeem Offer</button>
          ${
            hasCallbacks
              ? `<div class="me-agent-secondary-actions">${actionButtonsHtml}</div>`
              : ""
          }
        </div>
      </div>
    `;

    this.setupDetailListeners();
  }

  /**
   * Render variant selector with images
   */
  private renderVariantSelector(offerVariants?: OfferVariant[]): string {
    if (!offerVariants || offerVariants.length === 0) {
      return "";
    }

    return `
      <div class="me-agent-variant-section">
        <label class="me-agent-section-label">Variant</label>
        <div class="me-agent-variant-grid">
          ${offerVariants
            .map((offerVariant, index) => {
              const variant = offerVariant.variant;
              const image =
                variant.productImages?.[0]?.url ||
                "https://via.placeholder.com/80x80";
              const discountPct = offerVariant.discountPercentage || "0";
              const isOutOfStock = offerVariant.inventory <= 0;

              return `
              <button 
                class="me-agent-variant-card ${index === 0 ? "active" : ""} ${
                isOutOfStock ? "disabled" : ""
              }" 
                data-variant-index="${index}"
                ${isOutOfStock ? "disabled" : ""}
              >
                <div class="me-agent-variant-image" style="background-image: url('${image}')">
                  ${
                    !isOutOfStock
                      ? `<span class="me-agent-variant-discount">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    ${discountPct}% Off
                  </span>`
                      : ""
                  }
                </div>
              </button>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  /**
   * Render dummy reviews section
   */
  private renderReviews(): string {
    const dummyReviews = [
      {
        name: "John Doe",
        rating: 4,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      },
      {
        name: "Jane Smith",
        rating: 5,
        text: "Great product! Highly recommend. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        name: "Bob Johnson",
        rating: 4,
        text: "Good quality and fast shipping. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ];

    const ratings = [
      { stars: 5, count: 20 },
      { stars: 4, count: 50 },
      { stars: 3, count: 20 },
      { stars: 2, count: 6 },
      { stars: 1, count: 4 },
    ];

    const totalReviews = ratings.reduce((sum, r) => sum + r.count, 0);
    const avgRating = (
      ratings.reduce((sum, r) => sum + r.stars * r.count, 0) / totalReviews
    ).toFixed(1);

    return `
      <div class="me-agent-reviews">
        <div class="me-agent-reviews-summary">
          <div class="me-agent-reviews-bars">
            ${ratings
              .map(
                (r) => `
              <div class="me-agent-rating-row">
                <div class="me-agent-stars-small">
                  ${Array(5)
                    .fill(0)
                    .map(
                      (_, i) =>
                        `<span class="${i < r.stars ? "filled" : ""}">★</span>`
                    )
                    .join("")}
                </div>
                <div class="me-agent-rating-bar">
                  <div class="me-agent-rating-fill" style="width: ${
                    (r.count / totalReviews) * 100
                  }%"></div>
                </div>
                <span class="me-agent-rating-count">${r.count}</span>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="me-agent-reviews-score">
            <div class="me-agent-score-number">${avgRating} <span>/ 5</span></div>
            <div class="me-agent-stars-large">
              ${Array(5)
                .fill(0)
                .map(
                  (_, i) =>
                    `<span class="${
                      i < Math.floor(parseFloat(avgRating)) ? "filled" : ""
                    }">★</span>`
                )
                .join("")}
            </div>
            <div class="me-agent-review-count">${totalReviews} Reviews</div>
          </div>
        </div>

        <div class="me-agent-reviews-list">
          ${dummyReviews
            .map(
              (review) => `
            <div class="me-agent-review-item">
              <div class="me-agent-review-header">
                <div class="me-agent-reviewer-avatar"></div>
                <div>
                  <div class="me-agent-reviewer-name">${review.name}</div>
                  <div class="me-agent-review-stars">
                    ${Array(5)
                      .fill(0)
                      .map(
                        (_, i) =>
                          `<span class="${
                            i < review.rating ? "filled" : ""
                          }">★</span>`
                      )
                      .join("")}
                  </div>
                </div>
              </div>
              <p class="me-agent-review-text">${review.text}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  /**
   * Setup detail page event listeners
   */
  private setupDetailListeners(): void {
    // Back button
    const backBtn = this.element.querySelector(".me-agent-offers-back");
    backBtn?.addEventListener("click", () => this.showGrid(this.offers));

    // Close button
    const closeBtn = this.element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", this.onClose);

    // Redeem button
    const redeemBtn = this.element.querySelector(".me-agent-redeem-button");
    redeemBtn?.addEventListener("click", () => this.handleClaimOffer());

    // Quantity controls
    const quantityInput = this.element.querySelector(
      ".me-agent-quantity-input"
    ) as HTMLInputElement;
    const decreaseBtn = this.element.querySelector('[data-action="decrease"]');
    const increaseBtn = this.element.querySelector('[data-action="increase"]');

    decreaseBtn?.addEventListener("click", () => {
      const val = parseInt(quantityInput.value || "0");
      if (val > 0) quantityInput.value = String(val - 1);
    });

    increaseBtn?.addEventListener("click", () => {
      const val = parseInt(quantityInput.value || "0");
      quantityInput.value = String(val + 1);
    });

    // Tab switching
    const tabs = this.element.querySelectorAll(".me-agent-tab");
    const panes = this.element.querySelectorAll(".me-agent-tab-pane");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-tab");
        tabs.forEach((t) => t.classList.remove("active"));
        panes.forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        const activePane = this.element.querySelector(
          `[data-pane="${tabName}"]`
        );
        activePane?.classList.add("active");
      });
    });

    // Variant selection
    const variantCards = this.element.querySelectorAll(
      ".me-agent-variant-card"
    );
    variantCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        variantCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        if (this.currentOfferDetail?.offerVariants) {
          this.selectedVariant = this.currentOfferDetail.offerVariants[index];
        }
      });
    });

    // Action buttons
    if (this.config.onAddToCart && this.currentOfferDetail) {
      const addToCartBtn = this.element.querySelector(".me-agent-add-to-cart");
      addToCartBtn?.addEventListener("click", () => {
        if (this.currentOfferDetail && this.config.onAddToCart) {
          this.config.onAddToCart(this.currentOfferDetail);
        }
      });
    }

    if (this.config.onShare && this.currentOfferDetail) {
      const shareBtn = this.element.querySelector('[data-action="share"]');
      shareBtn?.addEventListener("click", () => {
        if (this.currentOfferDetail && this.config.onShare) {
          this.config.onShare(this.currentOfferDetail);
        }
      });
    }

    if (this.config.onLikeUnlike && this.currentOfferDetail) {
      const likeBtn = this.element.querySelector('[data-action="like"]');
      likeBtn?.addEventListener("click", () => {
        if (this.currentOfferDetail && this.config.onLikeUnlike) {
          const isLiked = !this.likedOffers[this.currentOfferDetail.id];
          this.likedOffers[this.currentOfferDetail.id] = isLiked;
          likeBtn.classList.toggle("liked", isLiked);
          this.config.onLikeUnlike(this.currentOfferDetail, isLiked);
        }
      });
    }
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
  private showConfirmation(
    reward: RewardBalance,
    swapAmount: SwapAmountResponse
  ): void {
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
