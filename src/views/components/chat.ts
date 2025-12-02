import {
  Message,
  QuickAction,
  Offer,
  Brand,
  Category,
  MeAgentConfig,
  ChatSession,
  ConversationMessage,
} from "../../types";
import { MessageComponent } from "./message";
import { QuickActionsComponent } from "./quick-actions";
import { OfferPreviewCard } from "./offer-preview";
import { CardList, CardListItem } from "./card-list";
import { ChatHistoryPopup } from "./chat-history";
import { DetailPanelController } from "../../controllers/detail-panel-controller";
import { OfferService } from "../../services/offer-service";
import { BrandService } from "../../services/brand-service";
import { RedemptionService } from "../../services/redemption-service";
import { MessageParser } from "../../services/message-parser";
import { APIClient } from "../../data/api/api-client";
import { generateId } from "../../core/utils/formatters";
import {
  getCloseIcon,
  getMaximizeIcon,
  getMinimizeIcon,
  getSendIcon,
  getAssistantAvatarIcon,
  getChatIcon,
} from "../shared/icons";

/**
 * Chat Popup Component
 */
export class ChatPopup {
  private element: HTMLDivElement;
  private messagesContainer: HTMLDivElement;
  private inputElement: HTMLInputElement;
  private sendButton: HTMLButtonElement;
  private maximizeButton: HTMLButtonElement;
  private position: "bottom-right" | "bottom-left";
  private onSendMessage: (message: string) => void;
  private onClose: () => void;
  private welcomeElement: HTMLDivElement | null = null;
  private isMaximized: boolean = false;
  private detailPanelController: DetailPanelController;
  private currentOffers: Offer[] = [];
  private sessionId: string | null = null;
  private apiClient: APIClient;
  private offerService: OfferService;
  private brandService: BrandService;
  private redemptionService: RedemptionService | null = null;
  private config: MeAgentConfig;
  private isSending: boolean = false;
  private historyPopup: ChatHistoryPopup;
  private historyDropdownButton: HTMLButtonElement | null = null;
  private onSessionSwitch: ((sessionId: string) => void) | null = null;
  private messageParser: MessageParser;

  constructor(
    position: "bottom-right" | "bottom-left",
    onSendMessage: (message: string) => void,
    onClose: () => void,
    apiClient: APIClient,
    sessionId: string | null,
    config: MeAgentConfig,
    redemptionService?: RedemptionService
  ) {
    this.position = position;
    this.onSendMessage = onSendMessage;
    this.onClose = onClose;
    this.apiClient = apiClient;
    this.sessionId = sessionId;
    this.config = config;
    this.redemptionService = redemptionService || null;

    // Initialize services
    this.offerService = new OfferService(apiClient.offerAPI);
    this.brandService = new BrandService(
      apiClient.brandAPI,
      apiClient.offerAPI
    );
    this.messageParser = new MessageParser();

    // Initialize detail panel controller
    if (!this.redemptionService) {
      throw new Error(
        "RedemptionService is required for DetailPanelController"
      );
    }
    this.detailPanelController = new DetailPanelController(
      config,
      this.offerService,
      this.brandService,
      this.redemptionService,
      () => this.hideDetailPanel()
    );

    this.element = this.create();
    this.messagesContainer = this.element.querySelector(".me-agent-messages")!;
    this.inputElement = this.element.querySelector(".me-agent-input")!;
    this.sendButton = this.element.querySelector(".me-agent-send-button")!;
    this.maximizeButton = this.element.querySelector(
      ".me-agent-maximize-button"
    )!;

    // Mount detail panel inside chat - controller provides its own wrapper
    this.element.appendChild(this.detailPanelController.getElement());

    // Initialize history popup
    this.historyPopup = new ChatHistoryPopup(
      () => this.handleNewChat(),
      (sessionId) => this.handleSessionSelect(sessionId),
      () => this.toggleHistoryDropdownIcon(false)
    );
    this.element.appendChild(this.historyPopup.getElement());

    this.setupEventListeners();
  }

  /**
   * Create the chat popup element
   */
  private create(): HTMLDivElement {
    const chat = document.createElement("div");
    chat.className = `me-agent-chat ${this.position}`;

    chat.innerHTML = `
      <div class="me-agent-chat-content">
        <div class="me-agent-chat-header">
          <button class="me-agent-chat-title-dropdown" aria-label="Open chat history">
            ${getChatIcon({
              width: 20,
              height: 20,
              className: "me-agent-chat-icon",
              color: "#999999",
            })}
            <h3 class="me-agent-chat-title">Chats</h3>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="me-agent-dropdown-icon">
              <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="me-agent-header-buttons">
            <button class="me-agent-maximize-button" aria-label="Maximize chat">
              <span class="me-agent-maximize-icon">${getMaximizeIcon({
                width: 16,
                height: 16,
              })}</span>
              <span class="me-agent-minimize-icon" style="display:none;">${getMinimizeIcon(
                { width: 16, height: 16 }
              )}</span>
            </button>
            <button class="me-agent-close-button" aria-label="Close chat">${getCloseIcon(
              { width: 20, height: 20 }
            )}</button>
          </div>
        </div>
        <div class="me-agent-messages"></div>
        <div class="me-agent-input-container">
          <div class="me-agent-input-content">
            <input 
              type="text" 
              class="me-agent-input" 
              placeholder="Ask or search anything..."
              aria-label="Message input"
            />
            <button class="me-agent-send-button" aria-label="Send message">${getSendIcon(
              { width: 18, height: 18 }
            )}</button>
          </div>
        </div>
      </div>
    `;

    return chat;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Close button
    const closeButton = this.element.querySelector(".me-agent-close-button");
    closeButton?.addEventListener("click", this.onClose);

    // Maximize button
    this.maximizeButton.addEventListener("click", () => this.toggleMaximize());

    // History dropdown button
    this.historyDropdownButton = this.element.querySelector(
      ".me-agent-chat-title-dropdown"
    );
    this.historyDropdownButton?.addEventListener("click", () =>
      this.toggleHistory()
    );

    // Send button
    this.sendButton.addEventListener("click", () => this.handleSend());

    // Enter key to send
    this.inputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    // Monitor input changes to enable/disable send button
    this.inputElement.addEventListener("input", () => {
      this.updateSendButtonState();
    });

    // Set initial send button state
    this.updateSendButtonState();
  }

  /**
   * Update send button state based on input value
   */
  private updateSendButtonState(): void {
    const hasText = this.inputElement.value.trim().length > 0;
    this.sendButton.disabled = !hasText || this.isSending;
  }

  /**
   * Handle send message
   */
  private handleSend(): void {
    // Prevent sending if already sending
    if (this.isSending) {
      return;
    }

    const message = this.inputElement.value.trim();
    if (message) {
      this.hideWelcome(); // Remove quick actions when user sends a message
      this.onSendMessage(message);
      this.inputElement.value = "";
      this.updateSendButtonState(); // Disable button after clearing input
    }
  }

  /**
   * Show welcome message with quick actions
   */
  showWelcome(): void {
    this.welcomeElement = document.createElement("div");
    this.welcomeElement.className =
      "me-agent-message assistant me-agent-welcome-message";

    const quickActions: QuickAction[] = [
      {
        id: "search",
        label: "Search for an offer",
        value: "Search for an offer",
        icon: "search",
      },
      {
        id: "offers",
        label: "Earn a reward",
        value: "Earn a reward",
        icon: "offers",
      },
      { id: "rewards", label: "My rewards", value: "My rewards", icon: "tags" },
    ];

    // Avatar
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "me-agent-message-avatar-wrapper";
    avatarDiv.innerHTML = getAssistantAvatarIcon({
      width: 32,
      height: 32,
      className: "me-agent-message-avatar",
    });

    // Content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "me-agent-message-content-wrapper";

    // Message content
    const contentDiv = document.createElement("div");
    contentDiv.className = "me-agent-message-content";
    contentDiv.innerHTML = `
      <div>How can I help you today?</div>
    `;

    // Quick actions
    const actionsContainer = QuickActionsComponent.create(
      quickActions,
      (action) => {
        // Hide only the quick actions, not the entire message
        actionsContainer.remove();
        this.onSendMessage(action.value);
      }
    );

    contentWrapper.appendChild(contentDiv);
    contentWrapper.appendChild(actionsContainer);
    this.welcomeElement.appendChild(avatarDiv);
    this.welcomeElement.appendChild(contentWrapper);

    this.messagesContainer.appendChild(this.welcomeElement);
  }

  /**
   * Hide welcome message (but keep the message, just remove quick actions)
   */
  hideWelcome(): void {
    if (this.welcomeElement) {
      // Just hide the quick actions, keep the welcome message visible
      const actionsContainer = this.welcomeElement.querySelector(
        ".me-agent-quick-actions"
      );
      if (actionsContainer) {
        actionsContainer.remove();
      }
    }
  }

  /**
   * Add a message to the chat
   */
  addMessage(message: Message): void {
    const messageElement = MessageComponent.create(message, (offerCode) => {
      this.handleOfferClick(offerCode);
    });
    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  /**
   * Show loading indicator
   */
  showLoading(): HTMLDivElement {
    const loadingElement = MessageComponent.createLoading();
    this.messagesContainer.appendChild(loadingElement);
    this.scrollToBottom();
    return loadingElement;
  }

  /**
   * Remove loading indicator
   */
  removeLoading(): void {
    const loadingElement = this.messagesContainer.querySelector(
      '[data-loading="true"]'
    );
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  /**
   * Update last message content (for streaming)
   */
  updateLastMessage(content: string): void {
    const messages = this.messagesContainer.querySelectorAll(
      ".me-agent-message.assistant"
    );
    const lastMessage = messages[messages.length - 1] as HTMLElement;
    if (lastMessage) {
      MessageComponent.updateContent(lastMessage, content, (offerCode) => {
        this.handleOfferClick(offerCode);
      });
      this.scrollToBottom();
    }
  }

  /**
   * Scroll to bottom of messages
   */
  private scrollToBottom(): void {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  /**
   * Toggle maximize/minimize
   */
  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;

    if (this.isMaximized) {
      // Maximizing
      this.element.classList.add("maximized");
      const maximizeIcon = this.maximizeButton.querySelector(
        ".me-agent-maximize-icon"
      ) as HTMLElement;
      const minimizeIcon = this.maximizeButton.querySelector(
        ".me-agent-minimize-icon"
      ) as HTMLElement;
      maximizeIcon.style.display = "none";
      minimizeIcon.style.display = "block";
      this.maximizeButton.setAttribute("aria-label", "Restore chat");

      // Scroll to bottom after animation
      setTimeout(() => this.scrollToBottom(), 300);
    } else {
      // Minimizing - hide detail panel first
      this.hideDetailPanel();

      // Trigger slide out animation
      this.element.classList.add("minimizing");

      const maximizeIcon = this.maximizeButton.querySelector(
        ".me-agent-maximize-icon"
      ) as HTMLElement;
      const minimizeIcon = this.maximizeButton.querySelector(
        ".me-agent-minimize-icon"
      ) as HTMLElement;

      // Wait for slide out animation to complete
      setTimeout(() => {
        // Remove maximized state and minimizing class
        this.element.classList.remove("maximized");
        this.element.classList.remove("minimizing");

        // Temporarily remove visible class to prepare for slide-in animation
        this.element.classList.remove("visible");

        // Update icons
        maximizeIcon.style.display = "block";
        minimizeIcon.style.display = "none";
        this.maximizeButton.setAttribute("aria-label", "Maximize chat");

        // Trigger slide-in animation from bottom
        setTimeout(() => {
          this.element.classList.add("visible");
          setTimeout(() => this.scrollToBottom(), 100);
        }, 50);
      }, 300);
    }
  }

  /**
   * Show the chat popup
   */
  show(): void {
    this.element.classList.add("visible");
    this.inputElement.focus();
  }

  /**
   * Hide the chat popup
   */
  hide(): void {
    // Reset maximize state first (without animation)
    if (this.isMaximized) {
      this.isMaximized = false;
      this.element.classList.remove("maximized");
      const maximizeIcon = this.maximizeButton.querySelector(
        ".me-agent-maximize-icon"
      ) as HTMLElement;
      const minimizeIcon = this.maximizeButton.querySelector(
        ".me-agent-minimize-icon"
      ) as HTMLElement;
      if (maximizeIcon) maximizeIcon.style.display = "block";
      if (minimizeIcon) minimizeIcon.style.display = "none";
      this.maximizeButton.setAttribute("aria-label", "Maximize chat");
    }

    // Then hide the chat
    this.element.classList.remove("visible");
    this.hideDetailPanel(); // Hide detail panel when closing chat
  }

  /**
   * Set loading state for input
   */
  setLoading(loading: boolean): void {
    this.isSending = loading;
    this.updateSendButtonState(); // Update send button based on loading state
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.messagesContainer.innerHTML = "";
    this.showWelcome();
  }

  /**
   * Show offer preview card - appends to the last assistant message
   */
  showOfferPreview(offers: Offer[]): void {
    // Create preview card with its own offers bound to the click handler
    const previewCard = OfferPreviewCard.create(offers, () =>
      this.showDetailPanel(offers)
    );

    // Find the last assistant message and append the card to its content wrapper
    const messages = this.messagesContainer.querySelectorAll(
      ".me-agent-message.assistant"
    );
    const lastMessage = messages[messages.length - 1] as HTMLElement;

    if (lastMessage) {
      MessageComponent.appendToMessage(lastMessage, previewCard);
    } else {
      // Fallback: append to messages container if no assistant message found
      this.messagesContainer.appendChild(previewCard);
    }

    this.scrollToBottom();
  }

  /**
   * Show brand preview card - appends to the last assistant message
   */
  showBrandPreview(brands: Brand[]): void {
    // Convert brands to CardListItem format
    const brandItems: CardListItem[] = brands.slice(0, 10).map((brand) => ({
      id: brand.id,
      title: brand.name,
      image:
        brand.logoUrl ||
        `https://via.placeholder.com/40x40?text=${brand.name.charAt(0)}`,
    }));

    // Create card list
    const brandCard = CardList.create({
      title: "List of brands that offer sign up rewards",
      items: brandItems,
      actionLabel: "View All",
      onAction: () => this.showBrandsDetail(brands),
    });

    // Find the last assistant message and append the card to its content wrapper
    const messages = this.messagesContainer.querySelectorAll(
      ".me-agent-message.assistant"
    );
    const lastMessage = messages[messages.length - 1] as HTMLElement;

    if (lastMessage) {
      MessageComponent.appendToMessage(lastMessage, brandCard);
    } else {
      // Fallback: append to messages container if no assistant message found
      this.messagesContainer.appendChild(brandCard);
    }

    this.scrollToBottom();
  }

  /**
   * Show brands detail panel with full list
   */
  private showBrandsDetail(brands: Brand[]): void {
    if (this.isMaximized) {
      this.detailPanelController.showBrandList(brands);
      this.element.classList.add("has-detail-panel");
    } else {
      this.toggleMaximize();
      // Wait for maximize animation
      setTimeout(() => {
        this.detailPanelController.showBrandList(brands);
        this.element.classList.add("has-detail-panel");
      }, 300);
    }
  }

  /**
   * Show category preview with card list
   */
  showCategoryPreview(categories: Category[]): void {
    const categoryItems: CardListItem[] = categories
      .slice(0, 10)
      .map((category) => ({
        id: category.categoryId,
        title: category.title || category.categoryName,
        image:
          category.image ||
          `https://via.placeholder.com/40x40?text=${(
            category.title || category.categoryName
          ).charAt(0)}`,
      }));

    const categoryCard = CardList.create({
      title: "List of category that offer purchase rewards",
      items: categoryItems,
      actionLabel: "View All",
      onAction: () => this.showCategoriesDetail(categories),
    });

    const messages = this.messagesContainer.querySelectorAll(
      ".me-agent-message.assistant"
    );
    const lastMessage = messages[messages.length - 1] as HTMLElement;
    if (lastMessage) {
      MessageComponent.appendToMessage(lastMessage, categoryCard);
    } else {
      this.messagesContainer.appendChild(categoryCard);
    }

    this.scrollToBottom();
  }

  /**
   * Show search category card list (for get_categories response)
   */
  showSearchCategoryCardList(categories: Category[]): void {
    const categoryItems: CardListItem[] = categories
      .slice(0, 10)
      .map((category) => ({
        id: category.categoryId,
        title: category.title || category.categoryName,
        image:
          category.image ||
          `https://via.placeholder.com/40x40?text=${(
            category.title || category.categoryName
          ).charAt(0)}`,
      }));

    const categoryCard = CardList.create({
      title: "Search for offers in these categories",
      items: categoryItems,
      actionLabel: "View All",
      onAction: () => this.showSearchCategoryDetail(categories),
    });

    const messages = this.messagesContainer.querySelectorAll(
      ".me-agent-message.assistant"
    );
    const lastMessage = messages[messages.length - 1] as HTMLElement;
    if (lastMessage) {
      MessageComponent.appendToMessage(lastMessage, categoryCard);
    } else {
      this.messagesContainer.appendChild(categoryCard);
    }

    this.scrollToBottom();
  }

  /**
   * Show search category detail (opens detail panel with category grid)
   */
  private showSearchCategoryDetail(categories: Category[]): void {
    const sessionId = this.sessionId || "";
    if (this.isMaximized) {
      this.detailPanelController.showSearchCategoryGrid(categories, sessionId);
      this.element.classList.add("has-detail-panel");
    } else {
      this.toggleMaximize();
      // Wait for maximize animation
      setTimeout(() => {
        this.detailPanelController.showSearchCategoryGrid(
          categories,
          sessionId
        );
        this.element.classList.add("has-detail-panel");
      }, 300);
    }
  }

  /**
   * Show categories detail panel with grid
   */
  private showCategoriesDetail(categories: Category[]): void {
    if (this.isMaximized) {
      this.detailPanelController.showCategoryGrid(categories);
      this.element.classList.add("has-detail-panel");
    } else {
      this.toggleMaximize();
      // Wait for maximize animation
      setTimeout(() => {
        this.detailPanelController.showCategoryGrid(categories);
        this.element.classList.add("has-detail-panel");
      }, 300);
    }
  }

  /**
   * Show ways to earn quick actions
   */
  showWaysToEarnActions(): void {
    const actions: QuickAction[] = [
      {
        id: "sign_up_brand",
        label: "Sign up for a brand",
        value: "Sign up for a brand",
        icon: "user",
      },
      {
        id: "purchase_brand",
        label: "Purchase from a brand",
        value: "Purchase from a brand",
        icon: "money",
      },
    ];

    const quickActionsElement = QuickActionsComponent.create(
      actions,
      (action) => {
        // Send the action label as a message
        this.onSendMessage(action.label);
      }
    );

    // Find the last assistant message and append the quick actions
    const messages = this.messagesContainer.querySelectorAll(
      ".me-agent-message.assistant"
    );
    const lastMessage = messages[messages.length - 1] as HTMLElement;

    if (lastMessage) {
      MessageComponent.appendToMessage(lastMessage, quickActionsElement);
    } else {
      // Fallback: append to messages container if no assistant message found
      this.messagesContainer.appendChild(quickActionsElement);
    }

    this.scrollToBottom();
  }

  /**
   * Show detail panel with offers
   */
  private showDetailPanel(offers: Offer[]): void {
    // Store the offers that are being displayed
    this.currentOffers = offers;

    // Auto-maximize when showing offers
    if (!this.isMaximized) {
      this.toggleMaximize();
    }

    this.element.classList.add("has-detail-panel");
    this.detailPanelController.showOfferGrid(offers, this.sessionId || "");
    this.detailPanelController.show();
  }

  /**
   * Hide detail panel
   */
  private hideDetailPanel(): void {
    this.element.classList.remove("has-detail-panel");
    this.detailPanelController.hide();
  }

  /**
   * Handle offer click
   */
  private async handleOfferClick(offerCode: string): Promise<void> {
    try {
      // Maximize widget if not already maximized
      if (!this.isMaximized) {
        this.toggleMaximize();
      }

      // Show the detail panel with offer details
      this.element.classList.add("has-detail-panel");
      await this.detailPanelController.showOfferDetail(
        offerCode,
        this.sessionId || ""
      );
    } catch (error) {
      console.error("Error fetching offer details:", error);
      alert("Failed to load offer details. Please try again.");
    }
  }

  /**
   * Mount the chat to the DOM
   */
  mount(): void {
    document.body.appendChild(this.element);
  }

  /**
   * Remove the chat from the DOM
   */
  unmount(): void {
    this.element.remove();
  }

  /**
   * Get the chat element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Update session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  // ============================================
  // Dev Mode Helper Methods
  // ============================================

  /**
   * Show offer detail (for dev mode)
   */
  async devShowOfferDetail(
    offerCode: string,
    sessionId: string
  ): Promise<void> {
    // Maximize if not already
    if (!this.isMaximized) {
      this.toggleMaximize();
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Show detail panel
    this.element.classList.add("has-detail-panel");
    await this.detailPanelController.showOfferDetail(offerCode, sessionId);

    // Show chat
    this.show();
  }

  /**
   * Show brand list (for dev mode)
   */
  devShowBrandList(): void {
    // For now, we'll need sample data or fetch from API
    console.warn("Dev: Brand list requires data - use AI chat to trigger");
  }

  /**
   * Show category grid (for dev mode)
   */
  devShowCategoryGrid(): void {
    // For now, we'll need sample data or fetch from API
    console.warn("Dev: Category grid requires data - use AI chat to trigger");
  }

  /**
   * Toggle history dropdown
   */
  private async toggleHistory(): Promise<void> {
    if (this.historyPopup.isOpen()) {
      this.historyPopup.hide();
      this.toggleHistoryDropdownIcon(false);
    } else {
      // Show popup immediately with loading state
      this.historyPopup.show();
      this.toggleHistoryDropdownIcon(true);

      // Fetch sessions in background
      try {
        const response = await this.apiClient.getUserSessions();
        this.historyPopup.updateSessions(response.sessions, this.sessionId);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        // Show error state in popup
        this.historyPopup.updateSessions([], this.sessionId);
      }
    }
  }

  /**
   * Toggle dropdown icon rotation
   */
  private toggleHistoryDropdownIcon(isOpen: boolean): void {
    if (this.historyDropdownButton) {
      if (isOpen) {
        this.historyDropdownButton.classList.add("open");
      } else {
        this.historyDropdownButton.classList.remove("open");
      }
    }
  }

  /**
   * Handle new chat
   */
  private handleNewChat(): void {
    // Clear current session
    this.sessionId = null;
    this.messagesContainer.innerHTML = "";
    this.showWelcome();
  }

  /**
   * Handle session selection from history
   */
  private async handleSessionSelect(sessionId: string): Promise<void> {
    try {
      // Fetch conversation messages
      const response = await this.apiClient.getConversation(sessionId);

      // Update session ID
      this.sessionId = sessionId;

      // Clear current messages
      this.messagesContainer.innerHTML = "";
      this.hideWelcome();

      // Track offers/brands/categories to show previews after all messages are added
      let lastOffers: Offer[] = [];
      let lastBrands: Brand[] = [];
      let lastCategories: Category[] = [];
      let shouldShowWaysToEarn = false;

      // Convert and add messages
      response.messages.forEach((msg) => {
        if (msg.content.parts[0]?.text) {
          const message: Message = {
            id: generateId(),
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content.parts[0].text,
            timestamp: Date.now(),
          };
          this.addMessage(message);
        }

        // Parse function responses to show offer/brand/category cards
        if (msg.role === "model") {
          const parsedData = this.messageParser.parseMessageData({
            content: msg.content,
          });

          if (parsedData.offers.length > 0) {
            lastOffers = parsedData.offers;
            lastBrands = []; // Clear brands/categories when offers are found
            lastCategories = [];
            shouldShowWaysToEarn = false;
          }
          if (parsedData.brands.length > 0) {
            lastBrands = parsedData.brands;
            lastOffers = []; // Clear offers/categories when brands are found
            lastCategories = [];
            shouldShowWaysToEarn = false;
          }
          if (parsedData.categories.length > 0) {
            lastCategories = parsedData.categories;
            lastOffers = []; // Clear offers/brands when categories are found
            lastBrands = [];
            shouldShowWaysToEarn = false;
          }
          if (parsedData.showWaysToEarn) {
            shouldShowWaysToEarn = true;
            lastOffers = [];
            lastBrands = [];
            lastCategories = [];
          }
        }
      });

      // Show the most recent preview (offers, brands, categories, or ways to earn)
      if (lastOffers.length > 0) {
        this.showOfferPreview(lastOffers);
      } else if (lastBrands.length > 0) {
        this.showBrandPreview(lastBrands);
      } else if (lastCategories.length > 0) {
        this.showCategoryPreview(lastCategories);
      } else if (shouldShowWaysToEarn) {
        this.showWaysToEarnActions();
      }

      // Notify parent of session switch (if callback is set)
      if (this.onSessionSwitch) {
        this.onSessionSwitch(sessionId);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  }

  /**
   * Set session switch callback
   */
  setOnSessionSwitch(callback: (sessionId: string) => void): void {
    this.onSessionSwitch = callback;
  }
}
