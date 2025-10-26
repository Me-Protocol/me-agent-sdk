import { Message, QuickAction, Offer, MeAgentConfig } from "../types";
import { MessageComponent } from "./components/message";
import { QuickActionsComponent } from "./components/quick-actions";
import { OfferPreviewCard } from "./components/offer-preview";
import { DetailPanel } from "./detail-panel";
import { RedeemManager } from "../redeem/manager";
import { APIClient } from "../api/client";
import {
  getCloseIcon,
  getMaximizeIcon,
  getMinimizeIcon,
  getSendIcon,
  getAssistantAvatarIcon,
  getChatIcon,
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
  private detailPanel: DetailPanel | null = null;
  private currentOffers: Offer[] = [];
  private sessionId: string = "";
  private apiClient: APIClient;
  private redeemManager: RedeemManager | null = null;
  private config: MeAgentConfig;

  constructor(
    position: "bottom-right" | "bottom-left",
    onSendMessage: (message: string) => void,
    onClose: () => void,
    apiClient: APIClient,
    sessionId: string,
    config: MeAgentConfig,
    redeemManager?: RedeemManager
  ) {
    this.position = position;
    this.onSendMessage = onSendMessage;
    this.onClose = onClose;
    this.apiClient = apiClient;
    this.sessionId = sessionId;
    this.config = config;
    this.redeemManager = redeemManager || null;
    this.element = this.create();
    this.messagesContainer = this.element.querySelector(".me-agent-messages")!;
    this.inputElement = this.element.querySelector(".me-agent-input")!;
    this.sendButton = this.element.querySelector(".me-agent-send-button")!;
    this.maximizeButton = this.element.querySelector(
      ".me-agent-maximize-button"
    )!;

    // Initialize detail panel
    this.detailPanel = new DetailPanel(
      () => this.hideDetailPanel(),
      (offerCode) => this.handleOfferClick(offerCode),
      config,
      this.redeemManager || undefined
    );

    // Mount detail panel inside chat
    const detailWrapper = this.element.querySelector(
      ".me-agent-detail-panel-wrapper"
    )!;
    detailWrapper.appendChild(this.detailPanel.getElement());

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
          <div class="me-agent-chat-title-container">
            ${getChatIcon({
              width: 20,
              height: 20,
              className: "me-agent-chat-icon",
              color: "#999999",
            })}
            <h3 class="me-agent-chat-title">Chats</h3>
          </div>
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
      <div class="me-agent-detail-panel-wrapper"></div>
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
    this.sendButton.disabled = !hasText;
  }

  /**
   * Handle send message
   */
  private handleSend(): void {
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
      <div>👋</div>
      <div>Hi there! Welcome, I am Meely. How would you like me to help you today?</div>
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
    this.element.classList.remove("visible");
    this.hideDetailPanel(); // Hide detail panel when closing chat
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
    this.detailPanel?.showGrid(offers);
    this.detailPanel?.show();
  }

  /**
   * Hide detail panel
   */
  private hideDetailPanel(): void {
    this.element.classList.remove("has-detail-panel");
    this.detailPanel?.hide();
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

      // Show the detail panel
      this.element.classList.add("has-detail-panel");
      this.detailPanel?.show();

      // Fetch and display offer details
      this.detailPanel?.showLoading();
      const offerDetail = await this.apiClient.fetchOfferDetails(
        offerCode,
        this.sessionId
      );
      this.detailPanel?.showDetail(offerDetail);
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
