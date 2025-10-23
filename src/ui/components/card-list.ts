/**
 * Card List Component - Reusable component for displaying lists in chat
 * Can be used for offers, earnings, recommendations, etc.
 */

import { getArrowRightIcon } from "../icons";

export interface CardListItem {
  id: string;
  image?: string;
  title: string;
  subtitle?: string;
  icon?: string;
}

export interface CardListConfig {
  items: CardListItem[];
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  onItemClick?: (item: CardListItem) => void;
}

export class CardList {
  /**
   * Create a card list element
   */
  static create(config: CardListConfig): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "me-agent-card-list";

    // Create preview with avatars (show up to 3, plus a 4th with count if more)
    const maxVisible = 3;
    const previewItems = config.items.slice(0, maxVisible);
    const remainingCount = config.items.length - maxVisible;

    const avatarGroup = previewItems
      .map((item, index) => {
        const imageUrl =
          item.image || `https://via.placeholder.com/40x40?text=${index + 1}`;
        return `<div class="me-agent-card-avatar" style="background-image: url('${imageUrl}'); z-index: ${
          index + 1
        };"></div>`;
      })
      .join("");

    // Add overlay avatar if there are more items
    const overlayAvatar =
      remainingCount > 0
        ? `<div class="me-agent-card-avatar me-agent-card-avatar-overlay" style="z-index: ${
            maxVisible + 1
          };">
          <span class="me-agent-card-avatar-count">+${
            remainingCount > 99 ? "99+" : remainingCount
          }</span>
         </div>`
        : "";

    container.innerHTML = `
      <div class="me-agent-card-list-content">
        <div class="me-agent-card-avatars">
          ${avatarGroup}
          ${overlayAvatar}
        </div>
        <div class="me-agent-card-list-text">
          <p class="me-agent-card-list-title">${
            config.title || `${config.items.length} items found`
          }</p>
          ${
            config.actionLabel
              ? `<button class="me-agent-card-list-button">${
                  config.actionLabel
                }${getArrowRightIcon({
                  width: 16,
                  height: 16,
                  color: "#0F0F0F",
                })}</button>`
              : ""
          }
        </div>
      </div>
    `;

    // Add event listener for action button
    if (config.onAction) {
      const button = container.querySelector(".me-agent-card-list-button");
      button?.addEventListener("click", config.onAction);
    }

    return container;
  }
}
