/**
 * Chat History Popup Component
 * Shows list of previous chat sessions
 */

import { ChatSession } from "../../types";
import { getCloseIcon } from "../shared/icons";

export class ChatHistoryPopup {
  private element: HTMLDivElement;
  private isVisible: boolean = false;
  private onNewChat: () => void;
  private onSelectSession: (sessionId: string) => void;
  private onClose: () => void;

  constructor(
    onNewChat: () => void,
    onSelectSession: (sessionId: string) => void,
    onClose: () => void
  ) {
    this.onNewChat = onNewChat;
    this.onSelectSession = onSelectSession;
    this.onClose = onClose;
    this.element = this.create();
  }

  /**
   * Create the popup element
   */
  private create(): HTMLDivElement {
    const popup = document.createElement("div");
    popup.className = "me-agent-history-popup";
    popup.style.display = "none";

    popup.innerHTML = `
      <div class="me-agent-history-header">
        <h3 class="me-agent-history-title">Chat History</h3>
        <button class="me-agent-history-close" aria-label="Close history">
          ${getCloseIcon({ width: 20, height: 20 })}
        </button>
      </div>
      <div class="me-agent-history-content">
        <button class="me-agent-new-chat-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          New Chat
        </button>
        <div class="me-agent-history-divider"></div>
        <div class="me-agent-history-label">Recent</div>
        <div class="me-agent-history-list"></div>
      </div>
    `;

    this.setupEventListeners(popup);
    return popup;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(popup: HTMLDivElement): void {
    // Close button
    const closeBtn = popup.querySelector(".me-agent-history-close");
    closeBtn?.addEventListener("click", () => this.hide());

    // New chat button
    const newChatBtn = popup.querySelector(".me-agent-new-chat-btn");
    newChatBtn?.addEventListener("click", () => {
      this.onNewChat();
      this.hide();
    });

    // Click outside to close
    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        this.hide();
      }
    });
  }

  /**
   * Show the popup with sessions
   */
  show(sessions?: ChatSession[], currentSessionId?: string | null): void {
    if (sessions) {
      this.renderSessions(sessions, currentSessionId || null);
    } else {
      this.showLoading();
    }
    this.element.style.display = "flex";
    this.isVisible = true;
  }

  /**
   * Update sessions after loading
   */
  updateSessions(
    sessions: ChatSession[],
    currentSessionId: string | null
  ): void {
    this.renderSessions(sessions, currentSessionId);
  }

  /**
   * Show loading state
   */
  private showLoading(): void {
    const listContainer = this.element.querySelector(
      ".me-agent-history-list"
    ) as HTMLDivElement;

    if (!listContainer) return;

    listContainer.innerHTML = `
      <div class="me-agent-history-loading">
        <div class="me-agent-history-spinner"></div>
        <p>Loading history...</p>
      </div>
    `;
  }

  /**
   * Hide the popup
   */
  hide(): void {
    this.element.style.display = "none";
    this.isVisible = false;
    this.onClose();
  }

  /**
   * Render session list
   */
  private renderSessions(
    sessions: ChatSession[],
    currentSessionId: string | null
  ): void {
    const listContainer = this.element.querySelector(
      ".me-agent-history-list"
    ) as HTMLDivElement;

    if (!listContainer) return;

    if (sessions.length === 0) {
      listContainer.innerHTML = `
        <div class="me-agent-history-empty">
          <p>No chat history yet</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = sessions
      .map((session) => {
        const isActive = session.extracted_id === currentSessionId;
        // Use the title field if available, otherwise fallback to extracting from raw_value
        const preview = session.title || this.extractPreview(session.raw_value);

        return `
          <div class="me-agent-history-item ${
            isActive ? "active" : ""
          }" data-session-id="${session.extracted_id}">
            <div class="me-agent-history-item-content">
              <div class="me-agent-history-item-preview">${preview}</div>
            </div>
          </div>
        `;
      })
      .join("");

    // Attach click listeners to session items
    const items = listContainer.querySelectorAll(".me-agent-history-item");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        const sessionId = item.getAttribute("data-session-id");
        if (sessionId) {
          this.onSelectSession(sessionId);
          this.hide();
        }
      });
    });
  }

  /**
   * Extract preview text from session raw_value
   */
  private extractPreview(rawValue: string): string {
    try {
      // Try to extract offer_name from state
      const offerNameMatch = rawValue.match(/'offer_name':\s*'([^']+)'/);
      if (offerNameMatch) {
        return offerNameMatch[1];
      }

      // Try to extract recent_searches
      const searchMatch = rawValue.match(/'recent_searches':\s*\[([^\]]+)\]/);
      if (searchMatch) {
        const search = searchMatch[1].replace(/'/g, "").trim();
        return search || "Chat session";
      }

      return "Chat session";
    } catch {
      return "Chat session";
    }
  }

  /**
   * Get the popup element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Check if popup is visible
   */
  isOpen(): boolean {
    return this.isVisible;
  }
}
