/**
 * Detail Panel Controller
 * Orchestrates the detail panel and routes between different views
 */
import { MeAgentConfig, Offer, Brand, Category } from "../types";
import { OfferService } from "../services/offer-service";
import { BrandService } from "../services/brand-service";
import { RedemptionService } from "../services/redemption-service";
export declare class DetailPanelController {
    private config;
    private offerService;
    private brandService;
    private redemptionService;
    private onClose;
    private container;
    private wrapper;
    private header;
    private headerTitle;
    private backButton;
    private closeButton;
    private content;
    private isVisible;
    private currentView;
    private viewStack;
    private sessionId;
    private currentAbortController;
    private currentOfferDetail;
    private selectedVariant;
    private quantity;
    private currentBrandsWithOffers;
    private userBalances;
    private selectedReward;
    private swapAmount;
    private offerGridView;
    private offerDetailView;
    private brandListView;
    private brandOffersView;
    private categoryGridView;
    private redemptionView;
    constructor(config: MeAgentConfig, offerService: OfferService, brandService: BrandService, redemptionService: RedemptionService, onClose: () => void);
    /**
     * Get the wrapper element
     */
    getElement(): HTMLElement;
    /**
     * Show the detail panel
     */
    show(): void;
    /**
     * Hide the detail panel
     */
    hide(): void;
    /**
     * Cancel any pending requests
     */
    private cancelCurrentRequest;
    /**
     * Update header title and back button visibility
     */
    private updateHeader;
    /**
     * Go back to previous view
     */
    goBack(): void;
    /**
     * Restore a view from state
     */
    private restoreView;
    /**
     * Show offer grid
     */
    showOfferGrid(offers: Offer[], sessionId: string): void;
    /**
     * Show offer detail
     */
    showOfferDetail(offerCode: string, sessionId: string): Promise<void>;
    /**
     * Show brand list
     */
    showBrandList(brands: Brand[]): void;
    /**
     * Show category grid
     */
    showCategoryGrid(categories: Category[]): void;
    /**
     * Show brands with offers for a category
     */
    showBrandsWithOffers(categoryId: string, token?: string): Promise<void>;
    /**
     * Attach event listeners for offer grid
     */
    private attachOfferGridListeners;
    /**
     * Attach event listeners for offer detail
     */
    private attachOfferDetailListeners;
    /**
     * Attach event listeners for brand list
     */
    private attachBrandListListeners;
    /**
     * Attach event listeners for category grid
     */
    private attachCategoryGridListeners;
    /**
     * Show all offers for a single brand
     */
    showSingleBrandOffers(brandId: string, brandName: string): void;
    /**
     * Attach event listeners for single brand offers grid
     */
    private attachSingleBrandOffersListeners;
    /**
     * Attach event listeners for brand offers
     */
    private attachBrandOffersListeners;
    /**
     * Attach cancel button listener during loading
     */
    private attachCancelLoadingListener;
    /**
     * Attach action button listeners (like, share, add to cart)
     */
    private attachActionListeners;
    /**
     * Handle redemption button click
     */
    private handleRedemption;
    /**
     * Find default reward to use for redemption
     */
    private findDefaultReward;
    /**
     * Calculate swap amount needed for redemption
     */
    private calculateSwapAmount;
    /**
     * Calculate swap amount and update the UI with result or error
     */
    private calculateAndUpdateSwapAmount;
    /**
     * Show redemption review step
     */
    private showRedemptionReview;
    /**
     * Attach listeners for redemption review step
     */
    private attachRedemptionReviewListeners;
    /**
     * Show list of available rewards for selection
     */
    private showRewardSelectionList;
    /**
     * Select a different reward
     */
    private selectReward;
    /**
     * Execute the redemption transaction
     */
    private executeRedemption;
    /**
     * Show redemption complete step
     */
    private showRedemptionComplete;
    /**
     * Attach listeners for redemption complete step
     */
    private attachRedemptionCompleteListeners;
    /**
     * Attach retry listener for redemption errors
     */
    private attachRedemptionRetryListener;
    /**
     * Attach back button listener
     */
    private attachBackButtonListener;
    /**
     * Select a variant
     */
    private selectVariant;
    /**
     * Change quantity
     */
    private changeQuantity;
    /**
     * Switch tab
     */
    private switchTab;
}
