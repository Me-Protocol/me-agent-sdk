import { QuickAction } from "../../types";
import {
  getSearchIcon,
  getTagIcon,
  getGiftIcon,
  getSparklesIcon,
  getUserIcon,
  getMoneyIcon,
} from "../icons";

/**
 * Quick Actions Component - Renders a list of actionable items
 */
export class QuickActionsComponent {
  /**
   * Get icon for action type
   */
  private static getIconForAction(action: QuickAction): string {
    const iconMap: Record<string, () => string> = {
      search: () =>
        getSearchIcon({
          width: 18,
          height: 18,
          className: "me-agent-quick-action-icon",
        }),
      offers: () =>
        getGiftIcon({
          width: 18,
          height: 18,
          className: "me-agent-quick-action-icon",
        }),
      tags: () =>
        getTagIcon({
          width: 18,
          height: 18,
          className: "me-agent-quick-action-icon",
        }),
      suggestions: () =>
        getSparklesIcon({
          width: 18,
          height: 18,
          className: "me-agent-quick-action-icon",
        }),
      user: () =>
        getUserIcon({
          width: 18,
          height: 18,
          className: "me-agent-quick-action-icon",
        }),
      money: () =>
        getMoneyIcon({
          width: 18,
          height: 18,
          className: "me-agent-quick-action-icon",
        }),
    };

    // Use icon from action if specified, otherwise use type-based icon
    if (action.icon && iconMap[action.icon]) {
      return iconMap[action.icon]();
    }

    // Default to sparkles icon
    return getSparklesIcon({
      width: 18,
      height: 18,
      className: "me-agent-quick-action-icon",
    });
  }

  /**
   * Create quick actions list
   */
  static create(
    actions: QuickAction[],
    onClick: (action: QuickAction) => void
  ): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "me-agent-quick-actions";

    actions.forEach((action) => {
      const button = document.createElement("button");
      button.className = "me-agent-quick-action-button";
      button.setAttribute("data-action-id", action.id);

      const icon = this.getIconForAction(action);
      button.innerHTML = `
        ${icon}
        <span class="me-agent-quick-action-text">${action.label}</span>
      `;

      button.addEventListener("click", () => onClick(action));

      container.appendChild(button);
    });

    return container;
  }

  /**
   * Create a message with quick actions
   */
  static createMessageWithActions(
    content: string,
    actions: QuickAction[],
    messageId: string,
    onActionClick: (action: QuickAction) => void
  ): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "me-agent-message-with-actions";
    wrapper.setAttribute("data-message-id", messageId);

    // Message content
    const contentDiv = document.createElement("div");
    contentDiv.className = "me-agent-message-actions-content";
    contentDiv.textContent = content;

    // Quick actions
    const actionsContainer = this.create(actions, onActionClick);

    wrapper.appendChild(contentDiv);
    wrapper.appendChild(actionsContainer);

    return wrapper;
  }
}
