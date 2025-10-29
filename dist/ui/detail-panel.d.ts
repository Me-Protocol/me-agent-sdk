import { Offer, Brand, Category, OfferDetail, MeAgentConfig } from "../types";
import { RedemptionService } from "../services/redemption-service";
import { APIClient } from "../data/api/api-client";
/**
 * Detail Panel Component - Handles side panel for offers, earnings, redemption, etc.
 */
export declare class DetailPanel {
    private element;
    private currentView;
    private offers;
    private brands;
    private categories;
    private onClose;
    private onOfferClick;
    private apiClient;
    private redemptionService;
    private currentOfferDetail;
    private selectedVariant;
    private selectedReward;
    private swapAmount;
    private config;
    private likedOffers;
    constructor(onClose: () => void, onOfferClick: (offerCode: string) => void, config: MeAgentConfig, apiClient: APIClient, redemptionService?: RedemptionService);
    /**
     * Create the offers panel element
     */
    private create;
    /**
     * Show offers grid
     */
    showGrid(offers: Offer[]): void;
    /**
     * Show brands detail list
     */
    showBrandsDetail(brands: Brand[]): void;
    /**
     * Format number with commas
     */
    private formatNumber;
    /**
     * Create a brand card HTML
     */
    private createBrandCard;
    /**
     * Show categories detail with 3-column grid
     */
    showCategoriesDetail(categories: Category[]): void;
    /**
     * Handle category card click - fetch brands and offers
     */
    private handleCategoryClick;
    /**
     * Show brands with their offers
     */
    private showBrandsWithOffers;
    /**
     * Create a brand card with horizontal offers
     */
    private createBrandWithOffersCard;
    /**
     * Create an offer card for brand offers view
     */
    private createBrandOfferCard;
    /**
     * Create a category card HTML
     */
    private createCategoryCard;
    /**
     * Create an offer card HTML
     */
    private createOfferCard;
    /**
     * Show loading state
     */
    showLoading(message?: string): void;
    /**
     * Render header with back button
     */
    private renderHeader;
    /**
     * Show offer details
     */
    showDetail(detail: OfferDetail): void;
    /**
     * Render variant selector with images
     */
    private renderVariantSelector;
    /**
     * Render dummy reviews section
     */
    private renderReviews;
    /**
     * Setup detail page event listeners
     */
    private setupDetailListeners;
    /**
     * Setup variant selection listeners
     */
    private setupVariantListeners;
    /**
     * Calculate final price
     */
    private calculateFinalPrice;
    /**
     * Handle claim offer button click
     */
    private handleClaimOffer;
    /**
     * Proceed to authentication check
     */
    private proceedToAuthentication;
    /**
     * Check ME Protocol login and handle accordingly
     */
    private checkAndHandleOnboarding;
    /**
     * Show loading view and execute ME Protocol login
     */
    private showAndExecuteLogin;
    /**
     * Show OTP verification view
     */
    private showOTPView;
    /**
     * Fetch balances and show reward selection
     */
    private fetchAndShowRewardSelection;
    /**
     * Show reward selection view
     */
    private showRewardSelection;
    /**
     * Handle reward selection
     */
    private handleRewardSelect;
    /**
     * Show affordability error
     */
    private showAffordabilityError;
    /**
     * Show confirmation view
     */
    private showConfirmation;
    /**
     * Get the panel element
     */
    getElement(): HTMLDivElement;
    /**
     * Show the panel
     */
    show(): void;
    /**
     * Hide the panel
     */
    hide(): void;
}
