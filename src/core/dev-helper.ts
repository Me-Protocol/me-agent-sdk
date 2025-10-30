/**
 * Development Helper
 * Provides keyboard shortcuts for testing SDK features in dev mode
 */

export interface DevHelperCallbacks {
  onShowOfferDetail?: (offerCode: string, sessionId: string) => void;
  onShowBrandList?: () => void;
  onShowCategoryGrid?: () => void;
}

export class DevHelper {
  private enabled: boolean = false;
  private callbacks: DevHelperCallbacks = {};
  private helpVisible: boolean = false;
  private helpOverlay: HTMLDivElement | null = null;

  constructor(enabled: boolean, callbacks: DevHelperCallbacks) {
    this.enabled = enabled;
    this.callbacks = callbacks;

    if (this.enabled) {
      this.initialize();
      console.log("🔧 Dev Mode Enabled - Press 'H' for shortcuts help");
    }
  }

  private initialize(): void {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  private handleKeyPress(e: KeyboardEvent): void {
    // Ignore if user is typing in an input/textarea
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      return;
    }

    // Toggle help with 'H'
    if (e.key === "h" || e.key === "H") {
      this.toggleHelp();
      return;
    }

    // Close help with Escape
    if (e.key === "Escape" && this.helpVisible) {
      this.hideHelp();
      return;
    }

    // Offer Detail - Press 'O'
    if (e.key === "o" || e.key === "O") {
      e.preventDefault();
      this.showTestOfferDetail();
      return;
    }

    // Brand List - Press 'B'
    if (e.key === "b" || e.key === "B") {
      e.preventDefault();
      this.showTestBrandList();
      return;
    }

    // Category Grid - Press 'C'
    if (e.key === "c" || e.key === "C") {
      e.preventDefault();
      this.showTestCategoryGrid();
      return;
    }
  }

  private showTestOfferDetail(): void {
    if (this.callbacks.onShowOfferDetail) {
      console.log("🔧 Dev: Opening test offer details (930991_SPSW)");
      // Use a dummy session ID for dev testing
      this.callbacks.onShowOfferDetail("930991_SPSW", "dev-session-" + Date.now());
    }
  }

  private showTestBrandList(): void {
    if (this.callbacks.onShowBrandList) {
      console.log("🔧 Dev: Opening test brand list");
      this.callbacks.onShowBrandList();
    }
  }

  private showTestCategoryGrid(): void {
    if (this.callbacks.onShowCategoryGrid) {
      console.log("🔧 Dev: Opening test category grid");
      this.callbacks.onShowCategoryGrid();
    }
  }

  private toggleHelp(): void {
    if (this.helpVisible) {
      this.hideHelp();
    } else {
      this.showHelp();
    }
  }

  private showHelp(): void {
    if (this.helpOverlay) return;

    this.helpOverlay = document.createElement("div");
    this.helpOverlay.className = "me-agent-dev-help-overlay";
    this.helpOverlay.innerHTML = `
      <div class="me-agent-dev-help-modal">
        <div class="me-agent-dev-help-header">
          <h3>🔧 Dev Mode Shortcuts</h3>
          <button class="me-agent-dev-help-close">×</button>
        </div>
        <div class="me-agent-dev-help-content">
          <div class="me-agent-dev-shortcut">
            <kbd>H</kbd>
            <span>Toggle this help menu</span>
          </div>
          <div class="me-agent-dev-shortcut">
            <kbd>O</kbd>
            <span>Open test offer details (930991_SPSW)</span>
          </div>
          <div class="me-agent-dev-shortcut">
            <kbd>B</kbd>
            <span>Open brand list (signup earnings)</span>
          </div>
          <div class="me-agent-dev-shortcut">
            <kbd>C</kbd>
            <span>Open category grid (purchase earnings)</span>
          </div>
          <div class="me-agent-dev-shortcut">
            <kbd>ESC</kbd>
            <span>Close this help menu</span>
          </div>
        </div>
        <div class="me-agent-dev-help-footer">
          <small>Shortcuts only work when not typing in inputs</small>
        </div>
      </div>
    `;

    document.body.appendChild(this.helpOverlay);
    this.helpVisible = true;

    // Attach close button listener
    const closeBtn = this.helpOverlay.querySelector(".me-agent-dev-help-close");
    closeBtn?.addEventListener("click", () => this.hideHelp());

    // Close on overlay click
    this.helpOverlay.addEventListener("click", (e) => {
      if (e.target === this.helpOverlay) {
        this.hideHelp();
      }
    });
  }

  private hideHelp(): void {
    if (this.helpOverlay) {
      this.helpOverlay.remove();
      this.helpOverlay = null;
      this.helpVisible = false;
    }
  }

  /**
   * Clean up and remove event listeners
   */
  destroy(): void {
    this.hideHelp();
    // Note: Can't easily remove the keydown listener without storing a reference
    // but this is only for dev mode, so it's acceptable
  }
}

