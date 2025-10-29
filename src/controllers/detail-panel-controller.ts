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
} from "../types";
import { OfferService } from "../services/offer-service";
import { BrandService } from "../services/brand-service";
import { OfferGridView } from "../views/offers/offer-grid-view";
import { OfferDetailView } from "../views/offers/offer-detail-view";
import { BrandListView } from "../views/brands/brand-list-view";
import { BrandOffersView } from "../views/brands/brand-offers-view";
import { CategoryGridView } from "../views/categories/category-grid-view";
import { getChevronLeftIcon, getCloseIcon } from "../views/shared/icons";

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
  private quantity: number = 1;
  private currentBrandsWithOffers: Array<{ brand: any; offers: any[] }> = [];

  // Views
  private offerGridView: OfferGridView;
  private offerDetailView: OfferDetailView;
  private brandListView: BrandListView;
  private brandOffersView: BrandOffersView;
  private categoryGridView: CategoryGridView;

  constructor(
    private config: MeAgentConfig,
    private offerService: OfferService,
    private brandService: BrandService,
    private onClose: () => void
  ) {
    // Initialize views
    this.offerGridView = new OfferGridView();
    this.offerDetailView = new OfferDetailView();
    this.brandListView = new BrandListView();
    this.brandOffersView = new BrandOffersView();
    this.categoryGridView = new CategoryGridView();

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
      this.quantity = 1;

      // Render offer detail
      this.content.innerHTML = this.offerDetailView.render(
        detail,
        this.selectedVariant,
        this.quantity,
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

    // Quantity controls
    const decreaseBtn = this.content.querySelector('[data-action="decrease"]');
    const increaseBtn = this.content.querySelector('[data-action="increase"]');

    decreaseBtn?.addEventListener("click", () => this.changeQuantity(-1));
    increaseBtn?.addEventListener("click", () => this.changeQuantity(1));

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
    const likeBtn = this.content.querySelector('[data-action="like"]');
    const shareBtn = this.content.querySelector('[data-action="share"]');
    const cartBtn = this.content.querySelector('[data-action="add-to-cart"]');

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
        this.quantity,
        this.config
      );
      this.attachOfferDetailListeners();
    }
  }

  /**
   * Change quantity
   */
  private changeQuantity(delta: number): void {
    const newQuantity = this.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      this.quantity = newQuantity;

      if (this.currentOfferDetail) {
        this.content.innerHTML = this.offerDetailView.render(
          this.currentOfferDetail,
          this.selectedVariant,
          this.quantity,
          this.config
        );
        this.attachOfferDetailListeners();
      }
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
