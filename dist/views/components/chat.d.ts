import { Message, Offer, Brand, Category, MeAgentConfig } from "../../types";
import { RedemptionService } from "../../services/redemption-service";
import { APIClient } from "../../data/api/api-client";
/**
 * Chat Popup Component
 */
export declare class ChatPopup {
    private element;
    private messagesContainer;
    private inputElement;
    private sendButton;
    private maximizeButton;
    private position;
    private onSendMessage;
    private onClose;
    private welcomeElement;
    private isMaximized;
    private detailPanelController;
    private currentOffers;
    private sessionId;
    private apiClient;
    private offerService;
    private brandService;
    private redemptionService;
    private config;
    constructor(position: "bottom-right" | "bottom-left", onSendMessage: (message: string) => void, onClose: () => void, apiClient: APIClient, sessionId: string, config: MeAgentConfig, redemptionService?: RedemptionService);
    /**
     * Create the chat popup element
     */
    private create;
    /**
     * Setup event listeners
     */
    private setupEventListeners;
    /**
     * Update send button state based on input value
     */
    private updateSendButtonState;
    /**
     * Handle send message
     */
    private handleSend;
    /**
     * Show welcome message with quick actions
     */
    showWelcome(): void;
    /**
     * Hide welcome message (but keep the message, just remove quick actions)
     */
    hideWelcome(): void;
    /**
     * Add a message to the chat
     */
    addMessage(message: Message): void;
    /**
     * Show loading indicator
     */
    showLoading(): HTMLDivElement;
    /**
     * Remove loading indicator
     */
    removeLoading(): void;
    /**
     * Update last message content (for streaming)
     */
    updateLastMessage(content: string): void;
    /**
     * Scroll to bottom of messages
     */
    private scrollToBottom;
    /**
     * Toggle maximize/minimize
     */
    toggleMaximize(): void;
    /**
     * Show the chat popup
     */
    show(): void;
    /**
     * Hide the chat popup
     */
    hide(): void;
    /**
     * Set loading state for input
     */
    setLoading(loading: boolean): void;
    /**
     * Clear all messages
     */
    clearMessages(): void;
    /**
     * Show offer preview card - appends to the last assistant message
     */
    showOfferPreview(offers: Offer[]): void;
    /**
     * Show brand preview card - appends to the last assistant message
     */
    showBrandPreview(brands: Brand[]): void;
    /**
     * Show brands detail panel with full list
     */
    private showBrandsDetail;
    /**
     * Show category preview with card list
     */
    showCategoryPreview(categories: Category[]): void;
    /**
     * Show categories detail panel with grid
     */
    private showCategoriesDetail;
    /**
     * Show ways to earn quick actions
     */
    showWaysToEarnActions(): void;
    /**
     * Show detail panel with offers
     */
    private showDetailPanel;
    /**
     * Hide detail panel
     */
    private hideDetailPanel;
    /**
     * Handle offer click
     */
    private handleOfferClick;
    /**
     * Mount the chat to the DOM
     */
    mount(): void;
    /**
     * Remove the chat from the DOM
     */
    unmount(): void;
    /**
     * Get the chat element
     */
    getElement(): HTMLDivElement;
}
