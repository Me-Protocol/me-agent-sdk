import {
  Offer,
  Brand,
  Category,
  OfferDetail,
  OfferVariant,
  RewardBalance,
  SwapAmountResponse,
  MeAgentConfig,
} from "../types";
import { RedeemManager } from "../redeem/manager";
import { APIClient } from "../api/client";
import { OTPView } from "./components/redemption/otp-view";
import { RewardSelectionView } from "./components/redemption/reward-selection-view";
import { AffordabilityErrorView } from "./components/redemption/error-view";
import { ConfirmationView } from "./components/redemption/confirmation-view";
import { OnboardingView } from "./components/redemption/onboarding-view";
import {
  getCloseIcon,
  getChevronLeftIcon,
  getExternalLinkIcon,
  getAwardIcon,
  getShirtIcon,
  getHeartPulseIcon,
  getSofaIcon,
  getTagIcon,
  getLayoutGridIcon,
  getLaptopIcon,
  getBookOpenIcon,
} from "./icons";

/**
 * Detail Panel Component - Handles side panel for offers, earnings, redemption, etc.
 */
export class DetailPanel {
  private element: HTMLDivElement;
  private currentView:
    | "grid"
    | "detail"
    | "brands"
    | "categories"
    | "otp-verify"
    | "onboarding"
    | "reward-select"
    | "confirm" = "grid";
  private offers: Offer[] = [];
  private brands: Brand[] = [];
  private categories: Category[] = [];
  private onClose: () => void;
  private onOfferClick: (offerCode: string) => void;
  private apiClient: APIClient;
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
    apiClient: APIClient,
    redeemManager?: RedeemManager
  ) {
    this.onClose = onClose;
    this.onOfferClick = onOfferClick;
    this.config = config;
    this.apiClient = apiClient;
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
   * Show brands detail list
   */
  showBrandsDetail(brands: Brand[]): void {
    this.brands = brands;
    this.currentView = "brands";

    const brandCardsHtml = brands
      .map((brand) => this.createBrandCard(brand))
      .join("");

    this.element.innerHTML = `
      <div class="me-agent-offers-header">
        <h3 class="me-agent-offers-title">Brands</h3>
        <button class="me-agent-offers-close" aria-label="Close">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-brands-list">
        ${brandCardsHtml}
      </div>
    `;

    // Add event listeners
    const closeBtn = this.element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", this.onClose);

    // Show the panel
    this.show();
  }

  /**
   * Format number with commas
   */
  private formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * Create a brand card HTML
   */
  private createBrandCard(brand: Brand): string {
    const logoUrl =
      brand.logoUrl ||
      `https://via.placeholder.com/80x80?text=${brand.name.charAt(0)}`;

    // Get reward details
    const points = brand.rewardDetails?.rules?.[0]?.points || 0;
    const formattedPoints = this.formatNumber(points);
    const rewardSymbol = brand.rewardDetails?.rewardInfo?.rewardSymbol || "";
    const rewardOriginalValue = parseFloat(
      brand.rewardDetails?.rewardInfo?.rewardOriginalValue || "0"
    );

    // Create conversion rate display (1 SYMBOL = $X.XX)
    const conversionRate =
      rewardOriginalValue > 0
        ? `1 ${rewardSymbol} = $${rewardOriginalValue.toFixed(2)}`
        : "";

    // Create callback URL with current origin
    const currentOrigin =
      typeof window !== "undefined" ? window.location.origin : "";
    const callbackUrl = encodeURIComponent(
      `${currentOrigin}?brand=${brand.id}&action=signup`
    );

    // Construct signup URL - use shopifyStoreUrl if available, otherwise websiteUrl
    let signupUrl = "#";
    if (brand.shopifyStoreUrl) {
      // For Shopify stores, add https:// if not present and append callback
      const shopifyUrl = brand.shopifyStoreUrl.startsWith("http")
        ? brand.shopifyStoreUrl
        : `https://${brand.shopifyStoreUrl}`;
      signupUrl = `${shopifyUrl}?return_to=${callbackUrl}`;
    } else if (brand.websiteUrl) {
      signupUrl = `${brand.websiteUrl}?return_to=${callbackUrl}`;
    }

    return `
      <div class="me-agent-brand-card" data-brand-id="${brand.id}">
        <div class="me-agent-brand-logo-container">
          <img src="${logoUrl}" alt="${
      brand.name
    }" class="me-agent-brand-logo" />
        </div>
        <div class="me-agent-brand-info">
          <h4 class="me-agent-brand-name">${brand.name}</h4>
          ${
            conversionRate
              ? `<p class="me-agent-brand-conversion">${conversionRate}</p>`
              : ""
          }
        </div>
        <div class="me-agent-brand-actions">
          ${
            points
              ? `<div class="me-agent-brand-reward-amount">${formattedPoints} <span class="me-agent-brand-reward-symbol">${rewardSymbol}</span></div>`
              : ""
          }
          <a href="${signupUrl}" target="_blank" rel="noopener noreferrer" class="me-agent-brand-signup-button">
            <span>Sign Up & Earn</span>
            ${getExternalLinkIcon({ width: 12, height: 12, color: "#0F0F0F" })}
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Show categories detail with 3-column grid
   */
  showCategoriesDetail(categories: Category[]): void {
    this.categories = categories;
    this.currentView = "categories";

    const categoryCardsHtml = categories
      .map((category) => this.createCategoryCard(category))
      .join("");

    this.element.innerHTML = `
      <div class="me-agent-offers-header">
        <h3 class="me-agent-offers-title">Categories</h3>
        <button class="me-agent-offers-close" aria-label="Close">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-categories-grid">
        ${categoryCardsHtml}
      </div>
    `;

    // Add event listeners
    const closeBtn = this.element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", this.onClose);

    // Add click listeners to category cards
    const categoryCards = this.element.querySelectorAll(
      ".me-agent-category-card"
    );
    categoryCards.forEach((card) => {
      card.addEventListener("click", async () => {
        const categoryId = card.getAttribute("data-category-id");
        if (categoryId) {
          await this.handleCategoryClick(categoryId);
        }
      });
    });

    // Show the panel
    this.show();
  }

  /**
   * Handle category card click - fetch brands and offers
   */
  private async handleCategoryClick(categoryId: string): Promise<void> {
    try {
      // Show loading state
      this.element.innerHTML = `
        <div class="me-agent-offers-header">
          <button class="me-agent-offers-back" aria-label="Back">${getChevronLeftIcon(
            { width: 20, height: 20 }
          )}</button>
          <h3 class="me-agent-offers-title">Loading...</h3>
          <button class="me-agent-offers-close" aria-label="Close">${getCloseIcon(
            { width: 20, height: 20 }
          )}</button>
        </div>
        <div class="me-agent-brands-list">
          <div class="me-agent-loading">Loading brands...</div>
        </div>
      `;

      // Fetch brands with purchase earning methods for this category
      const brands = await this.apiClient.fetchBrandsByCategoryId(categoryId);

      // Fetch offers for each brand in parallel
      const brandsWithOffers = await Promise.all(
        brands.map(async (brand: any) => {
          try {
            const offers = await this.apiClient.fetchOffersByBrandId(brand.id);
            return { ...brand, offers };
          } catch (error) {
            console.error(
              `Error fetching offers for brand ${brand.id}:`,
              error
            );
            return { ...brand, offers: [] };
          }
        })
      );

      // Filter out brands with no offers
      const brandsWithProducts = brandsWithOffers.filter(
        (brand) => brand.offers && brand.offers.length > 0
      );

      // Show brands with offers
      this.showBrandsWithOffers(brandsWithProducts, categoryId);
    } catch (error) {
      console.error("Error handling category click:", error);
      // Show error state
      this.element.innerHTML = `
        <div class="me-agent-offers-header">
          <button class="me-agent-offers-back" aria-label="Back">${getChevronLeftIcon(
            { width: 20, height: 20 }
          )}</button>
          <h3 class="me-agent-offers-title">Error</h3>
          <button class="me-agent-offers-close" aria-label="Close">${getCloseIcon(
            { width: 20, height: 20 }
          )}</button>
        </div>
        <div class="me-agent-brands-list">
          <p>Failed to load brands. Please try again.</p>
        </div>
      `;
    }
  }

  /**
   * Show brands with their offers
   */
  private showBrandsWithOffers(
    brandsWithOffers: any[],
    categoryId: string
  ): void {
    const brandsHtml = brandsWithOffers
      .map((brand) => this.createBrandWithOffersCard(brand))
      .join("");

    this.element.innerHTML = `
      <div class="me-agent-offers-header">
        <button class="me-agent-offers-back" aria-label="Back">${getChevronLeftIcon(
          { width: 20, height: 20 }
        )}</button>
        <h3 class="me-agent-offers-title">Brands & Offers</h3>
        <button class="me-agent-offers-close" aria-label="Close">${getCloseIcon(
          { width: 20, height: 20 }
        )}</button>
      </div>
      <div class="me-agent-brands-offers-list">
        ${
          brandsHtml ||
          '<p class="me-agent-empty-state">No brands found with available offers.</p>'
        }
      </div>
    `;

    // Add event listeners
    const backBtn = this.element.querySelector(".me-agent-offers-back");
    backBtn?.addEventListener("click", () => {
      this.showCategoriesDetail(this.categories);
    });

    const closeBtn = this.element.querySelector(".me-agent-offers-close");
    closeBtn?.addEventListener("click", this.onClose);

    // Add click listeners to offer cards
    const offerCards = this.element.querySelectorAll(
      ".me-agent-brand-offer-card"
    );
    offerCards.forEach((card) => {
      card.addEventListener("click", () => {
        const productUrl = card.getAttribute("data-product-url");
        if (productUrl) {
          // Open product URL in new tab
          window.open(productUrl, "_blank", "noopener,noreferrer");
        }
      });
    });
  }

  /**
   * Create a brand card with horizontal offers
   */
  private createBrandWithOffersCard(brand: any): string {
    const logoUrl =
      brand.logoUrl ||
      `https://via.placeholder.com/60x60?text=${brand.name.charAt(0)}`;

    // Calculate earning amount (percentage of purchase)
    const earningPercentage =
      brand.rewardDetails?.rules?.[0]?.earningPercentage || 0;
    const rewardSymbol = brand.rewardDetails?.rewardInfo?.rewardSymbol || "PTS";
    const rewardOriginalValue = parseFloat(
      brand.rewardDetails?.rewardInfo?.rewardOriginalValue || "0"
    );

    // Format earning display
    const earningDisplay =
      rewardOriginalValue > 0
        ? `Earn ${earningPercentage}% back (1 ${rewardSymbol} = $${rewardOriginalValue.toFixed(
            2
          )})`
        : `Earn ${earningPercentage}% back in ${rewardSymbol}`;

    // Create offers HTML
    const offersHtml = brand.offers
      .slice(0, 10) // Limit to 10 offers per brand
      .map((offer: any) => this.createBrandOfferCard(offer))
      .join("");

    return `
      <div class="me-agent-brand-offers-section">
        <div class="me-agent-brand-offers-header">
          <div class="me-agent-brand-offers-info">
            <img src="${logoUrl}" alt="${brand.name}" class="me-agent-brand-offers-logo" />
            <h4 class="me-agent-brand-offers-name">${brand.name}</h4>
          </div>
          <div class="me-agent-brand-earning-amount">${earningDisplay}</div>
        </div>
        <div class="me-agent-brand-offers-scroll">
          ${offersHtml}
        </div>
      </div>
    `;
  }

  /**
   * Create an offer card for brand offers view
   */
  private createBrandOfferCard(offer: any): string {
    const imageUrl =
      offer.coverImage || "https://via.placeholder.com/200x200?text=No+Image";
    const discountPercentage = parseFloat(offer.discountPercentage || "0");
    const originalPrice = parseFloat(offer.originalPrice || "0");
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);

    // Extract product URL from the offer
    const productUrl = offer.product?.productUrl || "";
    const fullProductUrl =
      productUrl && !productUrl.startsWith("http")
        ? `https://${productUrl}`
        : productUrl;

    return `
      <div class="me-agent-brand-offer-card" data-offer-code="${
        offer.offerCode
      }" data-product-url="${fullProductUrl}">
        <div class="me-agent-brand-offer-image-container">
          <img src="${imageUrl}" alt="${
      offer.name
    }" class="me-agent-brand-offer-image" />
          ${
            discountPercentage > 0
              ? `<div class="me-agent-brand-offer-badge">${discountPercentage.toFixed(
                  0
                )}% OFF</div>`
              : ""
          }
        </div>
        <div class="me-agent-brand-offer-info">
          <h5 class="me-agent-brand-offer-name">${offer.name}</h5>
          <div class="me-agent-brand-offer-pricing">
            ${
              discountPercentage > 0
                ? `
              <span class="me-agent-brand-offer-price">$${discountedPrice.toFixed(
                2
              )}</span>
              <span class="me-agent-brand-offer-original-price">$${originalPrice.toFixed(
                2
              )}</span>
            `
                : `<span class="me-agent-brand-offer-price">$${originalPrice.toFixed(
                    2
                  )}</span>`
            }
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create a category card HTML
   */
  private createCategoryCard(category: Category): string {
    const iconMap: Record<string, () => string> = {
      award: () => getAwardIcon({ width: 16, height: 16, color: "white" }),
      shirt: () => getShirtIcon({ width: 24, height: 24, color: "white" }),
      heartPulse: () =>
        getHeartPulseIcon({ width: 16, height: 16, color: "white" }),
      sofa: () => getSofaIcon({ width: 16, height: 16, color: "white" }),
      tag: () => getTagIcon({ width: 16, height: 16, color: "white" }),
      layoutGrid: () =>
        getLayoutGridIcon({ width: 16, height: 16, color: "white" }),
      laptop: () => getLaptopIcon({ width: 16, height: 16, color: "white" }),
      bookOpen: () =>
        getBookOpenIcon({ width: 16, height: 16, color: "white" }),
    };

    const iconSvg =
      category.icon && iconMap[category.icon] ? iconMap[category.icon]() : "";
    const title = (category.title || category.categoryName).replace(
      /\n/g,
      "<br>"
    );
    const brandCountText = `${category.brandCount} ${
      category.brandCount === 1 ? "Brand" : "Brands"
    }`;

    return `
      <div class="me-agent-category-card" data-category-id="${category.categoryId}">
        <div class="me-agent-category-icon-overlay">
          ${iconSvg}
        </div>
        <div class="me-agent-category-info">
          <h4 class="me-agent-category-title">${title}</h4>
          <p class="me-agent-category-brand-count">${brandCountText}</p>
        </div>
      </div>
    `;
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
