import { Message } from "../../types";
import { getUserAvatarIcon, getAssistantAvatarIcon } from "../shared/icons";

/**
 * Message Component - Renders individual chat messages
 */
export class MessageComponent {
  /**
   * Parse markdown-style content and convert to HTML
   */
  private static parseMarkdown(content: string): string {
    if (!content) return "";

    // Helper function to ensure URL has protocol
    const ensureProtocol = (url: string): string => {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return `https://${url}`;
      }
      return url;
    };

    // First, handle links with images: [text](url)(image-url)
    // This pattern appears when the AI includes both a link and an image
    let html = content.replace(
      /\[([^\]]+)\]\(([^\)]+)\)\(([^\)]+)\)/g,
      (match, text, linkUrl, imageUrl) => {
        // Ensure both URLs have protocol
        linkUrl = ensureProtocol(linkUrl);
        imageUrl = ensureProtocol(imageUrl);

        // Check if this is an offer link with an offer code
        const offerMatch = linkUrl.match(/\/offer\/([^\/\s]+)/);
        if (offerMatch) {
          const offerCode = offerMatch[1];
          return `<span class="me-agent-offer-link-with-image"><span class="me-agent-offer-thumbnail-wrapper"><img src="${imageUrl}" alt="${text}" class="me-agent-offer-thumbnail" /><div class="me-agent-offer-thumbnail-popover"><img src="${imageUrl}" alt="${text}" class="me-agent-offer-thumbnail-popover-image" /><div class="me-agent-offer-thumbnail-popover-title">${text}</div></div></span><a href="#" class="me-agent-offer-link" data-offer-code="${offerCode}">${text}</a></span>`;
        }
        // Otherwise, it's a regular product link
        return `<span class="me-agent-offer-link-with-image"><span class="me-agent-offer-thumbnail-wrapper"><img src="${imageUrl}" alt="${text}" class="me-agent-offer-thumbnail" /><div class="me-agent-offer-thumbnail-popover"><img src="${imageUrl}" alt="${text}" class="me-agent-offer-thumbnail-popover-image" /><div class="me-agent-offer-thumbnail-popover-title">${text}</div></div></span><a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a></span>`;
      }
    );

    // Then handle regular links without images: [text](url)
    html = html.replace(
      /\[([^\]]+)\]\(([^\)]+)\)/g,
      (match, text, url) => {
        // Ensure URL has protocol
        url = ensureProtocol(url);

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
   * Get avatar for message role
   */
  private static getAvatar(role: string): string {
    if (role === "user") {
      return getUserAvatarIcon({
        width: 32,
        height: 32,
        className: "me-agent-message-avatar",
      });
    }
    // Default to assistant avatar for "assistant" and "system" roles
    return getAssistantAvatarIcon({
      width: 32,
      height: 32,
      className: "me-agent-message-avatar",
    });
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

    // Avatar
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "me-agent-message-avatar-wrapper";
    avatarDiv.innerHTML = this.getAvatar(message.role);

    // Content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "me-agent-message-content-wrapper";

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

    contentWrapper.appendChild(contentDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentWrapper);

    return messageDiv;
  }

  /**
   * Create a loading indicator with dynamic status message
   */
  static createLoading(initialMessage: string = "Thinking"): HTMLDivElement {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "me-agent-message assistant";
    loadingDiv.setAttribute("data-loading", "true");

    // Avatar
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "me-agent-message-avatar-wrapper";
    avatarDiv.innerHTML = this.getAvatar("assistant");

    // Content wrapper
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "me-agent-message-content-wrapper";

    const contentDiv = document.createElement("div");
    contentDiv.className = "me-agent-message-content";

    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "me-agent-loading";
    loadingIndicator.innerHTML = `
      <span class="me-agent-loading-text">${initialMessage}</span>
      <span class="me-agent-loading-dots">
        <span class="me-agent-loading-dot"></span>
        <span class="me-agent-loading-dot"></span>
        <span class="me-agent-loading-dot"></span>
      </span>
    `;

    contentDiv.appendChild(loadingIndicator);
    contentWrapper.appendChild(contentDiv);
    loadingDiv.appendChild(avatarDiv);
    loadingDiv.appendChild(contentWrapper);

    return loadingDiv;
  }

  /**
   * Update the loading status message with animation
   */
  static updateLoadingMessage(
    loadingElement: HTMLElement,
    newMessage: string
  ): void {
    const textSpan = loadingElement.querySelector(".me-agent-loading-text");
    if (textSpan) {
      // Add fade-out class
      textSpan.classList.add("me-agent-status-fade-out");

      // After fade out, update text and fade in
      setTimeout(() => {
        textSpan.textContent = newMessage;
        textSpan.classList.remove("me-agent-status-fade-out");
        textSpan.classList.add("me-agent-status-fade-in");

        // Remove fade-in class after animation
        setTimeout(() => {
          textSpan.classList.remove("me-agent-status-fade-in");
        }, 200);
      }, 150);
    }
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

  /**
   * Append a card list or other element to a message's content wrapper
   */
  static appendToMessage(
    messageElement: HTMLElement,
    element: HTMLElement
  ): void {
    const contentWrapper = messageElement.querySelector(
      ".me-agent-message-content-wrapper"
    ) as HTMLElement;
    if (contentWrapper) {
      contentWrapper.appendChild(element);
    }
  }
}
