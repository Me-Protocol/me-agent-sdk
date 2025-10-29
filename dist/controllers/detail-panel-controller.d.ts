/**
 * Detail Panel Controller
 * Orchestrates the detail panel and routes between different views
 */
import { MeAgentConfig, Offer, Brand, Category } from "../types";
import { OfferService } from "../services/offer-service";
import { BrandService } from "../services/brand-service";
export declare class DetailPanelController {
    private config;
    private offerService;
    private brandService;
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
    private offerGridView;
    private offerDetailView;
    private brandListView;
    private brandOffersView;
    private categoryGridView;
    constructor(config: MeAgentConfig, offerService: OfferService, brandService: BrandService, onClose: () => void);
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
