/**
 * Detail Panel Controller
 * Orchestrates the detail panel and routes between different views
 */

import {
  MeAgentConfig,
  Offer,
  Brand,
  Category,
  OfferDetail,
  OfferVariant,
  RewardBalance,
} from "../types";
import { OfferService } from "../services/offer-service";
import { BrandService } from "../services/brand-service";
import { RedemptionService } from "../services/redemption-service";
import { OfferGridView } from "../views/offers/offer-grid-view";
import { OfferDetailView } from "../views/offers/offer-detail-view";
import { BrandListView } from "../views/brands/brand-list-view";
import { BrandOffersView } from "../views/brands/brand-offers-view";
import { CategoryGridView } from "../views/categories/category-grid-view";
import { RedemptionView } from "../views/redemption/redemption-view";
import { getChevronLeftIcon, getCloseIcon } from "../views/shared/icons";
import { BottomSheet } from "../views/components/bottom-sheet";

/**
 * Detail Panel Controller
 * Manages the side panel that displays offers, brands, categories, and redemption flows
 */
interface ViewState {
  type: string;
  title: string;
  data: any;
}

export class DetailPanelController {
  private container: HTMLElement;
  private wrapper: HTMLElement;
  private header: HTMLElement;
  private headerTitle: HTMLElement;
  private backButton: HTMLElement;
  private closeButton: HTMLElement;
  private content: HTMLElement;
  private isVisible: boolean = false;
  private currentView: string | null = null;
  private viewStack: ViewState[] = [];
  private sessionId: string = "";
  private currentAbortController: AbortController | null = null;

  // Current state
  private currentOfferDetail: OfferDetail | null = null;
  private selectedVariant: OfferVariant | null = null;
  private currentBrandsWithOffers: Array<{ brand: any; offers: any[] }> = [];

  // Redemption state
  private userBalances: RewardBalance[] = [];
  private selectedReward: RewardBalance | null = null;
  private swapAmount: {
    amount: number;
    amountNeeded: number;
    checkAffordability: boolean;
  } | null = null;

  // Views
  private offerGridView: OfferGridView;
  private offerDetailView: OfferDetailView;
  private brandListView: BrandListView;
  private brandOffersView: BrandOffersView;
  private categoryGridView: CategoryGridView;
  private redemptionView: RedemptionView;

  // Components
  private bottomSheet: BottomSheet | null = null;

  constructor(
    private config: MeAgentConfig,
    private offerService: OfferService,
    private brandService: BrandService,
    private redemptionService: RedemptionService,
    private onClose: () => void
  ) {
    // Initialize views
    this.offerGridView = new OfferGridView();
    this.offerDetailView = new OfferDetailView();
    this.brandListView = new BrandListView();
    this.brandOffersView = new BrandOffersView();
    this.categoryGridView = new CategoryGridView();
    this.redemptionView = new RedemptionView();

    // Create DOM elements
    this.wrapper = document.createElement("div");
    this.wrapper.className = "me-agent-detail-panel-wrapper";

    this.container = document.createElement("div");
    this.container.className = "me-agent-detail-panel";

    // Create fixed header
    this.header = document.createElement("div");
    this.header.className = "me-agent-detail-header";

    // Back button with title
    this.backButton = document.createElement("button");
    this.backButton.className = "me-agent-back-button";
    this.backButton.style.display = "none"; // Hidden by default
    this.backButton.addEventListener("click", () => this.goBack());

    // Title (standalone when no back)
    this.headerTitle = document.createElement("h2");
    this.headerTitle.className = "me-agent-detail-title";
    this.headerTitle.textContent = "Details";
    this.headerTitle.style.display = "block"; // Visible by default

    // Close button
    this.closeButton = document.createElement("button");
    this.closeButton.className = "me-agent-close-button";
    this.closeButton.innerHTML = getCloseIcon({ width: 20, height: 20 });
    this.closeButton.addEventListener("click", () => this.onClose());

    this.header.appendChild(this.backButton);
    this.header.appendChild(this.headerTitle);
    this.header.appendChild(this.closeButton);

    // Create content area
    this.content = document.createElement("div");
    this.content.className = "me-agent-detail-content";

    // Assemble
    this.container.appendChild(this.header);
    this.container.appendChild(this.content);
    this.wrapper.appendChild(this.container);

    // Initialize bottom sheet
    this.bottomSheet = new BottomSheet(this.wrapper);
  }

  /**
   * Get the wrapper element
   */
  getElement(): HTMLElement {
    return this.wrapper;
  }

  /**
   * Show the detail panel
   */
  show(): void {
    this.isVisible = true;
    this.container.classList.add("visible");
  }

  /**
   * Hide the detail panel
   */
  hide(): void {
    this.cancelCurrentRequest();
    this.isVisible = false;
    this.container.classList.remove("visible");
    this.viewStack = [];
    this.currentView = null;

    // Reset header to default state
    this.backButton.style.display = "none";
    this.headerTitle.style.display = "block";
    this.headerTitle.textContent = "Details";
  }

  /**
   * Cancel any pending requests
   */
  private cancelCurrentRequest(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
  }

  /**
   * Update header title and back button visibility
   */
  private updateHeader(title: string): void {
    // Show back button with title if there's more than one view in the stack
    if (this.viewStack.length > 1) {
      this.backButton.style.display = "flex";
      this.backButton.innerHTML = `
        ${getChevronLeftIcon({ width: 20, height: 20 })}
        <span style="margin-left: 8px;">${title}</span>
      `;
      this.headerTitle.style.display = "none";
    } else {
      // Just show title, no back button
      this.backButton.style.display = "none";
      this.headerTitle.style.display = "block";
      this.headerTitle.textContent = title;
    }
  }

  /**
   * Go back to previous view
   */
  goBack(): void {
    if (this.viewStack.length <= 1) {
      return; // No previous view
    }

    // Cancel any pending requests
    this.cancelCurrentRequest();

    // Pop current view
    this.viewStack.pop();

    // Get previous view state
    const previousView = this.viewStack[this.viewStack.length - 1];

    // Restore previous view
    this.restoreView(previousView);
  }

  /**
   * Restore a view from state
   */
  private restoreView(viewState: ViewState): void {
    switch (viewState.type) {
      case "offer-grid":
        this.content.innerHTML = this.offerGridView.render(viewState.data);
        this.attachOfferGridListeners();
        break;

      case "brand-list":
        const origin = window.location.origin;
        this.content.innerHTML = this.brandListView.render(
          viewState.data,
          origin
        );
        this.attachBrandListListeners();
        break;

      case "category-grid":
        this.content.innerHTML = this.categoryGridView.render(viewState.data);
        this.attachCategoryGridListeners();
        break;

      case "brand-offers":
        this.currentBrandsWithOffers = viewState.data;
        this.content.innerHTML = this.brandOffersView.render(viewState.data);
        this.attachBrandOffersListeners();
        break;

      case "single-brand-offers":
        this.content.innerHTML = this.brandOffersView.renderBrandOffersGrid(
          viewState.data.offers
        );
        this.attachSingleBrandOffersListeners();
        break;

      case "offer-detail":
        // Re-fetch offer detail as it needs dynamic data
        const { offerCode, sessionId } = viewState.data;
        this.showOfferDetail(offerCode, sessionId);
        return; // Avoid duplicate header update
    }

    this.currentView = viewState.type;
    this.updateHeader(viewState.title);
  }

  /**
   * Show offer grid
   */
  showOfferGrid(offers: Offer[], sessionId: string): void {
    this.sessionId = sessionId;
    this.content.innerHTML = this.offerGridView.render(offers);
    this.currentView = "offer-grid";
    this.viewStack = [
      {
        type: "offer-grid",
        title: "Available Offers",
        data: offers,
      },
    ];
    this.updateHeader("Available Offers");
    this.attachOfferGridListeners();
    this.show();
  }

  /**
   * Show offer detail
   */
  async showOfferDetail(offerCode: string, sessionId: string): Promise<void> {
    // Cancel any existing request
    this.cancelCurrentRequest();

    // Create new AbortController
    this.currentAbortController = new AbortController();
    const signal = this.currentAbortController.signal;

    try {
      // Show loading with cancel button
      this.content.innerHTML = this.offerGridView.renderLoading(true);
      this.attachCancelLoadingListener();
      this.updateHeader("Loading...");
      this.show();

      // Fetch offer details
      const detail = await this.offerService.getOfferDetail(
        offerCode,
        sessionId
      );

      // Check if request was aborted
      if (signal.aborted) {
        return;
      }

      this.currentOfferDetail = detail;
      this.selectedVariant = detail.offerVariants?.[0] || null;

      // Render offer detail
      this.content.innerHTML = this.offerDetailView.render(
        detail,
        this.selectedVariant,
        this.config
      );

      this.currentView = "offer-detail";
      this.viewStack.push({
        type: "offer-detail",
        title: "Product Details",
        data: { offerCode, sessionId },
      });
      this.updateHeader("Product Details");
      this.attachOfferDetailListeners();

      // Clear abort controller after successful completion
      this.currentAbortController = null;
    } catch (error) {
      // Don't show error if request was aborted
      if (signal.aborted) {
        return;
      }
      console.error("Error showing offer detail:", error);
      this.content.innerHTML = `<div class="me-agent-error">Failed to load offer details</div>`;
      this.updateHeader("Error");
      this.currentAbortController = null;
    }
  }

  /**
   * Show brand list
   */
  showBrandList(brands: Brand[]): void {
    const origin = window.location.origin;
    this.content.innerHTML = this.brandListView.render(brands, origin);
    this.currentView = "brand-list";
    this.viewStack = [
      {
        type: "brand-list",
        title: "Brands with Sign-Up Rewards",
        data: brands,
      },
    ];
    this.updateHeader("Brands with Sign-Up Rewards");
    this.attachBrandListListeners();
    this.show();
  }

  /**
   * Show category grid
   */
  showCategoryGrid(categories: Category[]): void {
    this.content.innerHTML = this.categoryGridView.render(categories);
    this.currentView = "category-grid";
    this.viewStack = [
      {
        type: "category-grid",
        title: "Purchase Earning Categories",
        data: categories,
      },
    ];
    this.updateHeader("Purchase Earning Categories");
    this.attachCategoryGridListeners();
    this.show();
  }

  /**
   * Show brands with offers for a category
   */
  async showBrandsWithOffers(
    categoryId: string,
    token?: string
  ): Promise<void> {
    // Cancel any existing request
    this.cancelCurrentRequest();

    // Create new AbortController
    this.currentAbortController = new AbortController();
    const signal = this.currentAbortController.signal;

    try {
      // Show loading with cancel button
      this.content.innerHTML = this.offerGridView.renderLoading(true);
      this.attachCancelLoadingListener();
      this.updateHeader("Loading...");
      this.show();

      // Fetch brands with offers
      const brandsWithOffers = await this.brandService.getBrandsWithOffers(
        categoryId,
        token
      );

      // Check if request was aborted
      if (signal.aborted) {
        return;
      }

      // Store and render brands with offers
      this.currentBrandsWithOffers = brandsWithOffers;
      this.content.innerHTML = this.brandOffersView.render(brandsWithOffers);
      this.currentView = "brand-offers";
      this.viewStack.push({
        type: "brand-offers",
        title: "Brands with Purchase Rewards",
        data: brandsWithOffers,
      });
      this.updateHeader("Brands with Purchase Rewards");
      this.attachBrandOffersListeners();

      // Clear abort controller after successful completion
      this.currentAbortController = null;
    } catch (error) {
      // Don't show error if request was aborted
      if (signal.aborted) {
        return;
      }
      console.error("Error showing brands with offers:", error);
      this.content.innerHTML = `<div class="me-agent-error">Failed to load brands</div>`;
      this.updateHeader("Error");
      this.currentAbortController = null;
    }
  }

  /**
   * Attach event listeners for offer grid
   */
  private attachOfferGridListeners(): void {
    // Offer cards (using brand-offer-card class for consistency)
    const offerCards = this.content.querySelectorAll(
      ".me-agent-brand-offer-card"
    );
    offerCards.forEach((card) => {
      card.addEventListener("click", () => {
        const offerCode = card.getAttribute("data-offer-code");
        if (offerCode && this.sessionId) {
          this.showOfferDetail(offerCode, this.sessionId);
        }
      });
    });
  }

  /**
   * Attach event listeners for offer detail
   */
  private attachOfferDetailListeners(): void {
    // Variant selection
    const variantCards = this.content.querySelectorAll(
      ".me-agent-variant-card"
    );
    variantCards.forEach((card) => {
      card.addEventListener("click", () => {
        const variantId = card.getAttribute("data-variant-id");
        if (variantId && this.currentOfferDetail) {
          this.selectVariant(variantId);
        }
      });
    });

    // Tabs
    const tabs = this.content.querySelectorAll(".me-agent-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-tab");
        if (tabName) {
          this.switchTab(tabName);
        }
      });
    });

    // Action buttons
    this.attachActionListeners();
  }

  /**
   * Attach event listeners for brand list
   */
  private attachBrandListListeners(): void {
    // No additional listeners needed - back/close handled by header
  }

  /**
   * Attach event listeners for category grid
   */
  private attachCategoryGridListeners(): void {
    // Category cards
    const categoryCards = this.content.querySelectorAll(
      ".me-agent-category-card"
    );
    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const categoryId = card.getAttribute("data-category-id");
        if (categoryId) {
          this.showBrandsWithOffers(categoryId);
        }
      });
    });
  }

  /**
   * Show all offers for a single brand
   */
  showSingleBrandOffers(brandId: string, brandName: string): void {
    // Find the brand from stored data
    const brandData = this.currentBrandsWithOffers.find(
      (item) => item.brand.id === brandId
    );

    if (!brandData) {
      console.error("Brand not found:", brandId);
      return;
    }

    // Render all offers for this brand
    this.content.innerHTML = this.brandOffersView.renderBrandOffersGrid(
      brandData.offers
    );
    this.currentView = "single-brand-offers";
    this.viewStack.push({
      type: "single-brand-offers",
      title: brandName,
      data: { brandId, brandName, offers: brandData.offers },
    });
    this.updateHeader(brandName);
    this.attachSingleBrandOffersListeners();
  }

  /**
   * Attach event listeners for single brand offers grid
   */
  private attachSingleBrandOffersListeners(): void {
    // Offer cards - navigate to product URL
    const offerCards = this.content.querySelectorAll(
      ".me-agent-brand-offer-card"
    );
    offerCards.forEach((card) => {
      card.addEventListener("click", () => {
        const productUrl = card.getAttribute("data-product-url");
        if (productUrl && productUrl !== "#") {
          window.open(productUrl, "_blank");
        }
      });
    });
  }

  /**
   * Attach event listeners for brand offers
   */
  private attachBrandOffersListeners(): void {
    // Offer cards - navigate to product URL
    const offerCards = this.content.querySelectorAll(
      ".me-agent-brand-offer-card"
    );
    offerCards.forEach((card) => {
      card.addEventListener("click", () => {
        const productUrl = card.getAttribute("data-product-url");
        if (productUrl && productUrl !== "#") {
          window.open(productUrl, "_blank");
        }
      });
    });

    // View All buttons
    const viewAllButtons = this.content.querySelectorAll(
      ".me-agent-view-all-offers-btn"
    );
    viewAllButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const brandSection = button.closest(".me-agent-brand-offers-section");
        const brandId = brandSection?.getAttribute("data-brand-id");
        const brandName = button.getAttribute("data-brand-name") || "Brand";

        if (brandId) {
          this.showSingleBrandOffers(brandId, brandName);
        }
      });
    });
  }

  /**
   * Attach cancel button listener during loading
   */
  private attachCancelLoadingListener(): void {
    const cancelBtn = this.content.querySelector(
      ".me-agent-cancel-loading-btn"
    );
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        // Cancel the current request
        this.cancelCurrentRequest();

        // Restore current view (top of stack) without popping
        const currentView = this.viewStack[this.viewStack.length - 1];
        if (currentView) {
          this.restoreView(currentView);
        }
      });
    }
  }

  /**
   * Attach action button listeners (like, share, add to cart)
   */
  private attachActionListeners(): void {
    const redeemBtn = this.content.querySelector('[data-action="redeem"]');
    const likeBtn = this.content.querySelector('[data-action="like"]');
    const shareBtn = this.content.querySelector('[data-action="share"]');
    const cartBtn = this.content.querySelector('[data-action="add-to-cart"]');

    // Redeem button
    redeemBtn?.addEventListener("click", () => {
      if (this.currentOfferDetail) {
        this.handleRedemption();
      }
    });

    likeBtn?.addEventListener("click", () => {
      if (this.currentOfferDetail && this.config.onLikeUnlike) {
        const isLiked = likeBtn.getAttribute("data-liked") === "true";
        this.config.onLikeUnlike(this.currentOfferDetail, !isLiked);
        likeBtn.setAttribute("data-liked", (!isLiked).toString());
        likeBtn.querySelector(".me-agent-action-icon")!.textContent = !isLiked
          ? "❤️"
          : "♡";
      }
    });

    shareBtn?.addEventListener("click", () => {
      if (this.currentOfferDetail && this.config.onShare) {
        this.config.onShare(this.currentOfferDetail);
      }
    });

    cartBtn?.addEventListener("click", () => {
      if (this.currentOfferDetail && this.config.onAddToCart) {
        this.config.onAddToCart(this.currentOfferDetail);
      }
    });
  }

  /**
   * Handle redemption button click
   */
  private async handleRedemption(): Promise<void> {
    if (!this.currentOfferDetail) return;

    try {
      // Show loading
      this.content.innerHTML = this.redemptionView.renderLoading();

      // Step 1: Check if email is available
      const email = this.redemptionService.getEmail();
      if (!email) {
        throw new Error(
          "Email is required for redemption. Please configure the SDK with an email address."
        );
      }

      // Step 2: Ensure Magic is logged in (will trigger OTP if needed)
      await this.redemptionService.ensureMagicLogin(email);

      // Step 3: Login to ME Protocol
      await this.redemptionService.loginToMEProtocol();

      // Step 4: Fetch user's reward balances
      this.userBalances = await this.redemptionService.fetchBalances();

      if (this.userBalances.length === 0) {
        this.content.innerHTML = `
          <div class="me-agent-error-message">
            <p>You don't have any reward tokens yet.</p>
            <button class="me-agent-try-again-btn" data-action="back">Go Back</button>
          </div>
        `;
        this.attachBackButtonListener();
        return;
      }

      // Step 3: Select default reward (offer's reward if available, else first reward)
      this.selectedReward = this.findDefaultReward();

      // Step 4: Show redemption review (with loading state for amount)
      this.swapAmount = {
        amount: 0,
        amountNeeded: 0,
        checkAffordability: false,
      }; // Placeholder
      this.showRedemptionReview();

      // Step 5: Calculate swap amount in background and update UI
      await this.calculateAndUpdateSwapAmount();
    } catch (error) {
      console.error("Redemption error:", error);
      this.content.innerHTML = this.redemptionView.renderError(
        error instanceof Error ? error.message : "Failed to start redemption"
      );
      this.attachRedemptionRetryListener();
    }
  }

  /**
   * Find default reward to use for redemption
   */
  private findDefaultReward(): RewardBalance {
    if (!this.currentOfferDetail) throw new Error("No offer selected");

    // Try to find the offer's reward
    const offerReward = this.userBalances.find(
      (r) => r.reward.id === this.currentOfferDetail!.reward.id
    );

    if (offerReward) return offerReward;

    // Otherwise use first reward
    return this.userBalances[0];
  }

  /**
   * Calculate swap amount needed for redemption
   */
  private async calculateSwapAmount(): Promise<void> {
    if (!this.currentOfferDetail || !this.selectedReward) return;

    const variant =
      this.selectedVariant || this.currentOfferDetail.offerVariants?.[0];
    const variantId = variant?.variant?.id || variant?.variantId;

    this.swapAmount = await this.redemptionService.calculateSwapAmount(
      this.selectedReward.reward.contractAddress,
      this.currentOfferDetail,
      variantId
    );
  }

  /**
   * Calculate swap amount and update the UI with result or error
   */
  private async calculateAndUpdateSwapAmount(): Promise<void> {
    if (!this.currentOfferDetail || !this.selectedReward) return;

    const amountElement = this.content.querySelector(".me-agent-amount-needed");
    const redeemButton = this.content.querySelector(
      ".me-agent-redeem-btn"
    ) as HTMLButtonElement;

    if (!amountElement) return;

    try {
      // Show loading
      amountElement.innerHTML = `
        <span style="display: flex; align-items: center; gap: 8px;">
          <span style="animation: spin 1s linear infinite;">⏳</span>
          Loading...
        </span>
      `;

      // Calculate amount
      await this.calculateSwapAmount();

      // Check if view was changed during calculation
      if (
        !this.swapAmount ||
        this.content.querySelector(".me-agent-redemption-container") === null
      ) {
        return;
      }

      // Update with actual amount
      amountElement.textContent = `${this.swapAmount.amountNeeded.toFixed(2)} ${
        this.selectedReward.reward.symbol
      }`;
      (amountElement as HTMLElement).style.color = "";

      // Enable/disable button based on affordability
      if (redeemButton) {
        const isAffordable =
          this.selectedReward.balance >= this.swapAmount.amountNeeded;
        redeemButton.disabled = !isAffordable;

        // Show insufficient balance message if needed
        if (!isAffordable) {
          const errorMsg = this.content.querySelector(
            ".me-agent-error-message"
          );
          if (!errorMsg) {
            const rewardSelection = this.content.querySelector(
              ".me-agent-reward-selection"
            );
            if (rewardSelection) {
              const errorDiv = document.createElement("div");
              errorDiv.className = "me-agent-error-message";
              errorDiv.innerHTML = `
                <p>Insufficient balance. You need ${this.swapAmount.amountNeeded.toFixed(
                  2
                )} ${
                this.selectedReward.reward.symbol
              } but only have ${this.selectedReward.balance.toFixed(2)}.</p>
              `;
              rewardSelection.appendChild(errorDiv);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calculating swap amount:", error);

      // Show error in red
      amountElement.innerHTML = `<span style="color: #ef4444;">Failed to fetch needed amount</span>`;

      // Disable redeem button
      if (redeemButton) {
        redeemButton.disabled = true;
      }
    }
  }

  /**
   * Show redemption review step
   */
  private showRedemptionReview(): void {
    if (!this.currentOfferDetail || !this.selectedReward || !this.swapAmount)
      return;

    const variant =
      this.selectedVariant || this.currentOfferDetail.offerVariants?.[0];

    this.viewStack.push({
      type: "redemption-review",
      title: "Complete Your Redemption",
      data: {
        offer: this.currentOfferDetail,
        reward: this.selectedReward,
        swapAmount: this.swapAmount,
        variant,
      },
    });

    this.content.innerHTML = this.redemptionView.renderReviewStep(
      this.currentOfferDetail,
      this.selectedReward,
      this.swapAmount,
      variant
    );

    this.updateHeader("Complete Your Redemption");
    this.attachRedemptionReviewListeners();
  }

  /**
   * Attach listeners for redemption review step
   */
  private attachRedemptionReviewListeners(): void {
    // Change reward button
    const changeRewardBtn = this.content.querySelector(
      ".me-agent-change-reward-btn"
    );
    changeRewardBtn?.addEventListener("click", () => {
      this.showRewardSelectionList();
    });

    // Redeem button
    const redeemBtn = this.content.querySelector(".me-agent-redeem-btn");
    redeemBtn?.addEventListener("click", async () => {
      await this.executeRedemption();
    });
  }

  /**
   * Show list of available rewards for selection
   */
  private showRewardSelectionList(): void {
    if (!this.userBalances.length || !this.bottomSheet) return;

    // Use view to generate HTML
    const listHTML = this.redemptionView.renderRewardList(
      this.userBalances,
      this.selectedReward?.reward.id || ""
    );

    // Show in bottom sheet
    this.bottomSheet.show("Select a Reward", listHTML);

    // Attach listeners after bottom sheet is shown
    setTimeout(() => {
      const contentElement = this.bottomSheet?.getContentElement();
      if (contentElement) {
        const rewardItems = contentElement.querySelectorAll(
          ".me-agent-reward-list-item"
        );
        rewardItems.forEach((item) => {
          item.addEventListener("click", async () => {
            const rewardId = item.getAttribute("data-reward-id");
            if (rewardId) {
              await this.selectReward(rewardId);
            }
          });
        });
      }
    }, 0);
  }

  /**
   * Select a different reward
   */
  private async selectReward(rewardId: string): Promise<void> {
    const reward = this.userBalances.find((r) => r.reward.id === rewardId);
    if (!reward) return;

    // Close bottom sheet
    this.bottomSheet?.hide();

    this.selectedReward = reward;
    this.swapAmount = { amount: 0, amountNeeded: 0, checkAffordability: false }; // Reset to loading state
    this.showRedemptionReview();
    await this.calculateAndUpdateSwapAmount();
  }

  /**
   * Execute the redemption transaction
   */
  private async executeRedemption(): Promise<void> {
    if (!this.currentOfferDetail || !this.selectedReward || !this.swapAmount)
      return;

    try {
      // Show processing step
      this.content.innerHTML = this.redemptionView.renderProcessingStep(
        this.currentOfferDetail
      );
      this.updateHeader("Processing");

      const variant =
        this.selectedVariant || this.currentOfferDetail.offerVariants?.[0];
      const variantId = variant?.id;

      // Determine if same-brand or cross-brand redemption
      const isSameBrand =
        this.selectedReward.reward.contractAddress ===
        this.currentOfferDetail.reward.contractAddress;

      let order;
      if (isSameBrand) {
        // Same brand redemption
        order = await this.redemptionService.executeSameBrandRedemption(
          this.selectedReward.reward.contractAddress,
          this.selectedReward.reward.id,
          this.swapAmount.amount.toString(),
          this.currentOfferDetail.id,
          this.currentOfferDetail.redemptionMethod.id,
          variantId
        );
      } else {
        // Cross brand redemption
        order = await this.redemptionService.executeCrossBrandRedemption(
          this.selectedReward.reward.contractAddress,
          this.selectedReward.reward.id,
          this.swapAmount.amount.toString(),
          this.swapAmount.amountNeeded.toString(),
          this.currentOfferDetail.reward.contractAddress,
          this.currentOfferDetail.id,
          this.currentOfferDetail.redemptionMethod.id,
          variantId
        );
      }

      // Show complete step
      this.showRedemptionComplete(order);
    } catch (error) {
      console.error("Redemption transaction error:", error);
      this.content.innerHTML = this.redemptionView.renderError(
        error instanceof Error
          ? error.message
          : "Redemption failed. Please try again."
      );
      this.updateHeader("Error");
      this.attachRedemptionRetryListener();
    }
  }

  /**
   * Show redemption complete step
   */
  private showRedemptionComplete(order: any): void {
    if (!this.currentOfferDetail) return;
    this.content.innerHTML = this.redemptionView.renderCompleteStep(
      order,
      this.currentOfferDetail
    );
    this.updateHeader("Complete");
    this.attachRedemptionCompleteListeners(order);
  }

  /**
   * Attach listeners for redemption complete step
   */
  private attachRedemptionCompleteListeners(order: any): void {
    // Copy coupon button
    const copyBtn = this.content.querySelector(".me-agent-copy-coupon-btn");
    copyBtn?.addEventListener("click", async () => {
      const couponCode = copyBtn.getAttribute("data-code");
      if (couponCode) {
        try {
          await navigator.clipboard.writeText(couponCode);
          copyBtn.textContent = "Copied!";
          setTimeout(() => {
            copyBtn.textContent = "Copy";
          }, 2000);
        } catch (error) {
          console.error("Failed to copy:", error);
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = couponCode;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
            copyBtn.textContent = "Copied!";
            setTimeout(() => {
              copyBtn.textContent = "Copy";
            }, 2000);
          } catch (err) {
            console.error("Fallback copy failed:", err);
          }
          document.body.removeChild(textArea);
        }
      }
    });

    // Use coupon button
    const useCouponBtn = this.content.querySelector(".me-agent-use-coupon-btn");
    useCouponBtn?.addEventListener("click", async () => {
      try {
        if (!this.currentOfferDetail) {
          alert("Offer details not available.");
          return;
        }

        // Show loading state
        const originalText = useCouponBtn.textContent;
        useCouponBtn.textContent = "Generating checkout...";
        (useCouponBtn as HTMLButtonElement).disabled = true;

        // Get the variant that was redeemed
        const variant =
          this.selectedVariant || this.currentOfferDetail.offerVariants?.[0];

        if (!variant?.variant?.variantIdOnBrandSite) {
          throw new Error("Product variant ID not available");
        }

        const checkoutUrl = await this.redemptionService.getCheckoutUrl(
          this.currentOfferDetail.brand.id,
          variant.variant.variantIdOnBrandSite
        );

        // Open checkout in new tab
        window.open(checkoutUrl, "_blank");

        // Reset button state
        useCouponBtn.textContent = originalText;
        (useCouponBtn as HTMLButtonElement).disabled = false;
      } catch (error) {
        console.error("Error getting checkout URL:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to generate checkout URL. Please use the coupon code manually."
        );

        // Reset button state
        useCouponBtn.textContent = "Use Coupon";
        (useCouponBtn as HTMLButtonElement).disabled = false;
      }
    });
  }

  /**
   * Attach retry listener for redemption errors
   */
  private attachRedemptionRetryListener(): void {
    const retryBtn = this.content.querySelector(
      '[data-action="retry-redemption"]'
    );
    retryBtn?.addEventListener("click", () => {
      // If we already have user balances and selected reward, go back to review step
      // Otherwise, restart the entire redemption flow
      if (
        this.userBalances.length > 0 &&
        this.selectedReward &&
        this.currentOfferDetail
      ) {
        this.showRedemptionReview();
        this.calculateAndUpdateSwapAmount();
      } else {
        this.handleRedemption();
      }
    });
  }

  /**
   * Attach back button listener
   */
  private attachBackButtonListener(): void {
    const backBtn = this.content.querySelector('[data-action="back"]');
    backBtn?.addEventListener("click", () => {
      this.goBack();
    });
  }

  /**
   * Select a variant
   */
  private selectVariant(variantId: string): void {
    if (!this.currentOfferDetail) return;

    const variant = this.currentOfferDetail.offerVariants?.find(
      (v) => v.id === variantId
    );
    if (variant) {
      this.selectedVariant = variant;

      // Re-render
      this.content.innerHTML = this.offerDetailView.render(
        this.currentOfferDetail,
        this.selectedVariant,
        this.config
      );
      this.attachOfferDetailListeners();
    }
  }

  /**
   * Switch tab
   */
  private switchTab(tabName: string): void {
    // Remove active class from all tabs and panes
    this.content.querySelectorAll(".me-agent-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    this.content.querySelectorAll(".me-agent-tab-pane").forEach((pane) => {
      pane.classList.remove("active");
    });

    // Add active class to selected tab and pane
    const selectedTab = this.content.querySelector(`[data-tab="${tabName}"]`);
    const selectedPane = this.content.querySelector(`[data-pane="${tabName}"]`);

    selectedTab?.classList.add("active");
    selectedPane?.classList.add("active");
  }
}
