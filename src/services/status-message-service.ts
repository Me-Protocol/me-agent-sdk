/**
 * Status Message Service
 *
 * Handles dynamic status message generation during AI processing.
 * Picks random phrases and fills templates with context.
 */

import {
  STATUS_MESSAGES,
  GENERIC_STARTED_MESSAGES,
} from "../core/constants/status-messages";

export interface StatusContext {
  query?: string;
  count?: number;
  tool?: string;
}

export class StatusMessageService {
  private lastMessageIndex: Record<string, number> = {};

  /**
   * Get a status message for a given event type
   */
  getMessage(
    eventType: "started" | "tool_call" | "results_found" | "error",
    context: StatusContext = {}
  ): string {
    let messagePool: string[];

    switch (eventType) {
      case "started":
        messagePool = context.query
          ? STATUS_MESSAGES.started
          : GENERIC_STARTED_MESSAGES;
        break;

      case "tool_call":
        const toolMessages =
          context.tool && STATUS_MESSAGES.tool_call[context.tool];
        messagePool = toolMessages || STATUS_MESSAGES.fallback;
        break;

      case "results_found":
        messagePool = STATUS_MESSAGES.results_found;
        break;

      case "error":
        messagePool = STATUS_MESSAGES.error;
        break;

      default:
        messagePool = STATUS_MESSAGES.fallback;
    }

    // Pick a random message (avoid repeating the last one)
    const message = this.pickRandom(messagePool, eventType);

    // Fill in template placeholders
    return this.fillTemplate(message, context);
  }

  /**
   * Pick a random message, avoiding the last used one for variety
   */
  private pickRandom(pool: string[], poolKey: string): string {
    if (pool.length === 0) {
      return "Processing...";
    }

    if (pool.length === 1) {
      return pool[0];
    }

    // Get a random index different from the last one
    let index: number;
    const lastIndex = this.lastMessageIndex[poolKey];

    do {
      index = Math.floor(Math.random() * pool.length);
    } while (index === lastIndex && pool.length > 1);

    this.lastMessageIndex[poolKey] = index;
    return pool[index];
  }

  /**
   * Fill template placeholders with context values
   */
  private fillTemplate(template: string, context: StatusContext): string {
    let result = template;

    // Replace {query} - truncate if too long
    if (context.query) {
      const displayQuery =
        context.query.length > 30
          ? context.query.substring(0, 30) + "..."
          : context.query;
      result = result.replace("{query}", displayQuery);
    } else {
      // Remove {query} placeholder if no query provided
      result = result.replace(" for {query}", "");
      result = result.replace(" {query}", "");
      result = result.replace("{query}", "items");
    }

    // Replace {count}
    if (context.count !== undefined) {
      result = result.replace("{count}", context.count.toString());
    } else {
      // Use generic if no count
      result = result.replace("{count} ", "");
      result = result.replace("{count}", "some");
    }

    // Replace {tool}
    if (context.tool) {
      const friendlyToolName = this.getToolDisplayName(context.tool);
      result = result.replace("{tool}", friendlyToolName);
    }

    return result;
  }

  /**
   * Get a user-friendly display name for a tool
   */
  private getToolDisplayName(tool: string): string {
    const toolNames: Record<string, string> = {
      query_offers: "offers",
      query_products: "products",
      get_categories: "categories",
      get_signup_earning_brands: "brands",
      ways_to_earn: "rewards",
      get_reward_details: "rewards",
      get_category_purchase_earning: "earnings",
      redirect_to_signup_page: "signup",
      redirect_to_store_page: "store",
    };

    return toolNames[tool] || tool;
  }

  /**
   * Reset the last message tracking (useful for new conversations)
   */
  reset(): void {
    this.lastMessageIndex = {};
  }
}

// Export singleton instance
export const statusMessageService = new StatusMessageService();
