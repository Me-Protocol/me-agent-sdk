/**
 * Detail Panel Component
 * Orchestrates side panel views and interactions
 */
import { Offer, Brand, Category, OfferDetail, MeAgentConfig } from "../../types";
import { RedemptionService } from "../../services/redemption-service";
import { APIClient } from "../../data/api/api-client";
/**
 * Detail Panel Component
 * Manages panel state and delegates rendering to view classes
 */
export declare class DetailPanel {
    private element;
    private currentView;
    private offers;
    private brands;
    private categories;
    private currentOfferDetail;
    private selectedVariant;
    private selectedReward;
    private swapAmount;
    private quantity;
    private onClose;
    private onOfferClick;
    private apiClient;
    private redemptionService;
    private config;
    private likedOffers;
    private offerGridView;
    private offerDetailView;
    private brandListView;
    private brandOffersView;
    private categoryGridView;
    constructor(onClose: () => void, onOfferClick: (offerCode: string) => void, config: MeAgentConfig, apiClient: APIClient, redemptionService?: RedemptionService);
    /**
     * Create the panel element
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
     * Show categories grid
     */
    showCategoriesDetail(categories: Category[]): void;
    /**
     * Show brands with their offers
     */
    showBrandsWithOffers(categoryId: string): Promise<void>;
    /**
     * Show offer detail
     */
    showDetail(detail: OfferDetail): void;
    /**
     * Show loading state
     */
    showLoading(message?: string): void;
    /**
     * Show OTP verification view
     */
    private showOTPVerification;
    /**
     * Show onboarding/authentication view
     */
    private showOnboarding;
    /**
     * Fetch balances and show reward selection
     */
    private fetchBalancesAndShowSelection;
    /**
     * Show reward selection view
     */
    private showRewardSelection;
    /**
     * Show affordability error
     */
    private showAffordabilityError;
    /**
     * Show confirmation view
     */
    private showConfirmation;
    /**
     * Start redemption flow
     */
    private startRedemption;
    /**
     * Attach event listeners to current view
     */
    private attachEventListeners;
    /**
     * Handle back navigation
     */
    private handleBack;
    /**
     * Show the panel
     */
    show(): void;
    /**
     * Hide the panel
     */
    hide(): void;
    /**
     * Get the panel element
     */
    getElement(): HTMLDivElement;
    /**
     * Mount the panel to a container
     */
    mount(container: HTMLElement): void;
}
