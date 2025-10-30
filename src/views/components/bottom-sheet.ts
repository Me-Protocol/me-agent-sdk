/**
 * Bottom Sheet Modal Component
 * A modal that slides up from the bottom of the screen
 */

import { getCloseIcon } from "../shared/icons";

export class BottomSheet {
  private overlay: HTMLElement;
  private sheet: HTMLElement;
  private contentElement: HTMLElement;
  private isVisible: boolean = false;
  private onCloseCallback?: () => void;

  constructor(private container: HTMLElement) {
    this.overlay = this.createOverlay();
    this.sheet = this.createSheet();
    this.contentElement = this.sheet.querySelector(
      ".me-agent-bottom-sheet-content"
    ) as HTMLElement;
  }

  /**
   * Create overlay element
   */
  private createOverlay(): HTMLElement {
    const overlay = document.createElement("div");
    overlay.className = "me-agent-bottom-sheet-overlay";
    overlay.addEventListener("click", () => this.hide());
    return overlay;
  }

  /**
   * Create sheet element
   */
  private createSheet(): HTMLElement {
    const sheet = document.createElement("div");
    sheet.className = "me-agent-bottom-sheet";
    sheet.innerHTML = `
      <div class="me-agent-bottom-sheet-header">
        <h3 class="me-agent-bottom-sheet-title"></h3>
        <button class="me-agent-bottom-sheet-close" data-action="close">
          ${getCloseIcon({ width: 16, height: 16 })}
        </button>
      </div>
      <div class="me-agent-bottom-sheet-content"></div>
    `;

    // Prevent clicks inside sheet from closing it
    sheet.addEventListener("click", (e) => e.stopPropagation());

    // Close button
    const closeBtn = sheet.querySelector(
      '[data-action="close"]'
    ) as HTMLElement;
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hide());
    }

    return sheet;
  }

  /**
   * Show the bottom sheet
   */
  show(title: string, content: string, onClose?: () => void): void {
    this.onCloseCallback = onClose;

    // Update title and content
    const titleElement = this.sheet.querySelector(
      ".me-agent-bottom-sheet-title"
    ) as HTMLElement;
    if (titleElement) {
      titleElement.textContent = title;
    }

    this.contentElement.innerHTML = content;

    // Append to container if not already
    if (!this.overlay.parentElement) {
      this.container.appendChild(this.overlay);
      this.container.appendChild(this.sheet);
    }

    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.classList.add("visible");
      this.sheet.classList.add("visible");
      this.isVisible = true;
    });
  }

  /**
   * Hide the bottom sheet
   */
  hide(): void {
    this.overlay.classList.remove("visible");
    this.sheet.classList.remove("visible");
    this.isVisible = false;

    // Remove from DOM after animation
    setTimeout(() => {
      if (!this.isVisible && this.overlay.parentElement) {
        this.overlay.remove();
        this.sheet.remove();
      }
    }, 300);

    // Call onClose callback
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  /**
   * Get the content element for attaching event listeners
   */
  getContentElement(): HTMLElement {
    return this.contentElement;
  }

  /**
   * Check if bottom sheet is visible
   */
  isOpen(): boolean {
    return this.isVisible;
  }

  /**
   * Destroy the bottom sheet
   */
  destroy(): void {
    this.hide();
    this.overlay.remove();
    this.sheet.remove();
  }
}
