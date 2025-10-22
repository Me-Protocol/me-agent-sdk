import { Message } from "../types";

/**
 * Message Component - Renders individual chat messages
 */
export class MessageComponent {
  /**
   * Parse markdown-style content and convert to HTML
   */
  private static parseMarkdown(content: string): string {
    if (!content) return "";

    // Convert markdown links [text](url) to HTML links
    // Special handling for offer links
    let html = content.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      (match, text, url) => {
        // Check if this is an offer link
        const offerMatch = url.match(/\/offer\/([^\/\s]+)/);
        if (offerMatch) {
          const offerCode = offerMatch[1];
          return `<a href="#" class="me-agent-offer-link" data-offer-code="${offerCode}">${text}</a>`;
        }
        // Regular external link
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
    );

    // Convert bold **text** to <strong>
    html = html.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");

    // Convert italic *text* to <em>
    html = html.replace(/\*([^\*]+)\*/g, "<em>$1</em>");

    // Convert line breaks to <br>
    html = html.replace(/\n/g, "<br>");

    return html;
  }

  /**
   * Create a message element
   */
  static create(
    message: Message,
    onOfferClick?: (offerCode: string) => void
  ): HTMLDivElement {
    const messageDiv = document.createElement("div");
    messageDiv.className = `me-agent-message ${message.role}`;
    messageDiv.setAttribute("data-message-id", message.id);

    const contentDiv = document.createElement("div");
    contentDiv.className = "me-agent-message-content";

    // Parse markdown and set as HTML
    contentDiv.innerHTML = this.parseMarkdown(message.content);

    // Add click handlers for offer links
    if (onOfferClick) {
      const offerLinks = contentDiv.querySelectorAll(".me-agent-offer-link");
      offerLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const offerCode = (link as HTMLElement).getAttribute(
            "data-offer-code"
          );
          if (offerCode) {
            onOfferClick(offerCode);
          }
        });
      });
    }

    messageDiv.appendChild(contentDiv);

    return messageDiv;
  }

  /**
   * Create a loading indicator
   */
  static createLoading(): HTMLDivElement {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "me-agent-message assistant";
    loadingDiv.setAttribute("data-loading", "true");

    const contentDiv = document.createElement("div");
    contentDiv.className = "me-agent-message-content";

    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "me-agent-loading";
    loadingIndicator.innerHTML = `
      <div class="me-agent-loading-dot"></div>
      <div class="me-agent-loading-dot"></div>
      <div class="me-agent-loading-dot"></div>
    `;

    contentDiv.appendChild(loadingIndicator);
    loadingDiv.appendChild(contentDiv);

    return loadingDiv;
  }

  /**
   * Update message content (for streaming)
   */
  static updateContent(
    element: HTMLElement,
    content: string,
    onOfferClick?: (offerCode: string) => void
  ): void {
    const contentDiv = element.querySelector(".me-agent-message-content");
    if (contentDiv) {
      // Parse markdown and update HTML
      contentDiv.innerHTML = this.parseMarkdown(content);

      // Re-attach click handlers for offer links
      if (onOfferClick) {
        const offerLinks = contentDiv.querySelectorAll(".me-agent-offer-link");
        offerLinks.forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const offerCode = (link as HTMLElement).getAttribute(
              "data-offer-code"
            );
            if (offerCode) {
              onOfferClick(offerCode);
            }
          });
        });
      }
    }
  }
}
