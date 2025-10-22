import { getBotIcon } from "./icons";

/**
 * Floating Button Component
 */

export class FloatingButton {
  private element: HTMLButtonElement;
  private position: "bottom-right" | "bottom-left";
  private onClick: () => void;

  constructor(position: "bottom-right" | "bottom-left", onClick: () => void) {
    this.position = position;
    this.onClick = onClick;
    this.element = this.create();
  }

  /**
   * Create the button element
   */
  private create(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `me-agent-button ${this.position}`;
    button.setAttribute("aria-label", "Open chat");

    // Add bot icon
    button.innerHTML = getBotIcon({
      width: 32,
      height: 35,
      className: "me-agent-button-icon",
    });

    button.addEventListener("click", this.onClick);

    return button;
  }

  /**
   * Mount the button to the DOM
   */
  mount(): void {
    document.body.appendChild(this.element);
  }

  /**
   * Remove the button from the DOM
   */
  unmount(): void {
    this.element.remove();
  }

  /**
   * Get the button element
   */
  getElement(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Hide the button
   */
  hide(): void {
    this.element.classList.add("hidden");
  }

  /**
   * Show the button
   */
  show(): void {
    this.element.classList.remove("hidden");
  }
}
