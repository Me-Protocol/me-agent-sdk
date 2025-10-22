import { Message, QuickAction, Offer } from "../types";
import { MessageComponent } from "./message";
import { OfferPreviewCard } from "./offer-preview";
import { OffersPanel } from "./offers";
import { RedeemManager } from "../redeem/manager";
import { APIClient } from "../api/client";
import {
  getCloseIcon,
  getMaximizeIcon,
  getMinimizeIcon,
  getSendIcon,
} from "./icons";

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
  private offersPanel: OffersPanel | null = null;
  private currentOffers: Offer[] = [];
  private sessionId: string = "";
  private apiClient: APIClient;
  private redeemManager: RedeemManager | null = null;

  constructor(
    position: "bottom-right" | "bottom-left",
    onSendMessage: (message: string) => void,
    onClose: () => void,
    apiClient: APIClient,
    sessionId: string,
    redeemManager?: RedeemManager
  ) {
    this.position = position;
    this.onSendMessage = onSendMessage;
    this.onClose = onClose;
    this.apiClient = apiClient;
    this.sessionId = sessionId;
    this.redeemManager = redeemManager || null;
    this.element = this.create();
    this.messagesContainer = this.element.querySelector(".me-agent-messages")!;
    this.inputElement = this.element.querySelector(".me-agent-input")!;
    this.sendButton = this.element.querySelector(".me-agent-send-button")!;
    this.maximizeButton = this.element.querySelector(
      ".me-agent-maximize-button"
    )!;

    // Initialize offers panel
    this.offersPanel = new OffersPanel(
      () => this.hideOffersPanel(),
      (offerCode) => this.handleOfferClick(offerCode),
      this.redeemManager || undefined
    );

    // Mount offers panel inside chat
    const offersWrapper = this.element.querySelector(
      ".me-agent-offers-panel-wrapper"
    )!;
    offersWrapper.appendChild(this.offersPanel.getElement());

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
          <h3 class="me-agent-chat-title">AI Assistant</h3>
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
          <input 
            type="text" 
            class="me-agent-input" 
            placeholder="Type your message..."
            aria-label="Message input"
          />
          <button class="me-agent-send-button" aria-label="Send message">${getSendIcon(
            { width: 18, height: 18 }
          )}</button>
        </div>
      </div>
      <div class="me-agent-offers-panel-wrapper"></div>
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

    // Send button
    this.sendButton.addEventListener("click", () => this.handleSend());

    // Enter key to send
    this.inputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });
  }

  /**
   * Handle send message
   */
  private handleSend(): void {
    const message = this.inputElement.value.trim();
    if (message) {
      this.onSendMessage(message);
      this.inputElement.value = "";
    }
  }

  /**
   * Show welcome message with quick actions
   */
  showWelcome(): void {
    this.welcomeElement = document.createElement("div");
    this.welcomeElement.className = "me-agent-welcome";

    const quickActions: QuickAction[] = [
      { label: "🔍 Search for an offer", value: "Search for an offer" },
      { label: "🎁 Earn a reward", value: "Earn a reward" },
    ];

    this.welcomeElement.innerHTML = `
      <h4 class="me-agent-welcome-title">How can I help today?</h4>
      <div class="me-agent-quick-actions">
        ${quickActions
          .map(
            (action, index) => `
          <button class="me-agent-quick-action" data-action-index="${index}">
            ${action.label}
          </button>
        `
          )
          .join("")}
      </div>
    `;

    // Add click handlers for quick actions
    this.welcomeElement
      .querySelectorAll(".me-agent-quick-action")
      .forEach((button, index) => {
        button.addEventListener("click", () => {
          const action = quickActions[index];
          this.onSendMessage(action.value);
        });
      });

    this.messagesContainer.appendChild(this.welcomeElement);
  }

  /**
   * Hide welcome message
   */
  hideWelcome(): void {
    if (this.welcomeElement) {
      this.welcomeElement.remove();
      this.welcomeElement = null;
    }
  }

  /**
   * Add a message to the chat
   */
  addMessage(message: Message): void {
    this.hideWelcome();
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
      // Minimizing - hide offers panel first
      this.hideOffersPanel();

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
    this.element.classList.remove("visible");
    this.hideOffersPanel(); // Hide offers when closing chat
    if (this.isMaximized) {
      this.toggleMaximize(); // Reset to normal size when closing
    }
  }

  /**
   * Set loading state for input
   */
  setLoading(loading: boolean): void {
    this.inputElement.disabled = loading;
    this.sendButton.disabled = loading;
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.messagesContainer.innerHTML = "";
    this.showWelcome();
  }

  /**
   * Show offer preview card
   */
  showOfferPreview(offers: Offer[]): void {
    // Create preview card with its own offers bound to the click handler
    const previewCard = OfferPreviewCard.create(offers, () =>
      this.showOffersPanel(offers)
    );
    this.messagesContainer.appendChild(previewCard);
    this.scrollToBottom();
  }

  /**
   * Show offers panel
   */
  private showOffersPanel(offers: Offer[]): void {
    // Store the offers that are being displayed
    this.currentOffers = offers;

    // Auto-maximize when showing offers
    if (!this.isMaximized) {
      this.toggleMaximize();
    }

    this.element.classList.add("has-offers-panel");
    this.offersPanel?.showGrid(offers);
    this.offersPanel?.show();
  }

  /**
   * Hide offers panel
   */
  private hideOffersPanel(): void {
    this.element.classList.remove("has-offers-panel");
    this.offersPanel?.hide();
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

      // Show the offers panel
      this.element.classList.add("has-offers-panel");
      this.offersPanel?.show();

      // Fetch and display offer details
      this.offersPanel?.showLoading();
      const offerDetail = await this.apiClient.fetchOfferDetails(
        offerCode,
        this.sessionId
      );
      this.offersPanel?.showDetail(offerDetail);
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
}
