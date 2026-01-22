import { SearchOption } from "../../types";
import { getSearchIcon } from "../shared/icons";

/**
 * Search Options Component - Renders clickable suggestion chips
 * Used when search returns no/few results to suggest alternative queries
 */
export class SearchOptionsComponent {
  /**
   * Create search options as clickable chips
   * @param options - Array of search options from the backend
   * @param onClick - Callback when an option is clicked (receives the label to use as query)
   */
  static create(
    options: SearchOption[],
    onClick: (label: string) => void
  ): HTMLDivElement {
    console.log("[SearchOptions] Received options:", JSON.stringify(options, null, 2));

    const container = document.createElement("div");
    container.className = "me-agent-search-options";

    // Optional header
    const header = document.createElement("div");
    header.className = "me-agent-search-options-header";
    header.textContent = "Try searching for:";
    container.appendChild(header);

    // Options container (for flex wrap)
    const optionsWrapper = document.createElement("div");
    optionsWrapper.className = "me-agent-search-options-wrapper";

    options.forEach((option: any) => {
      const chip = document.createElement("button");
      chip.className = "me-agent-search-option-chip";

      // Handle both option formats:
      // - FallbackOption: { display_text, query_text }
      // - SearchOption: { label, action, label_with_count }
      const displayLabel = option.display_text || option.label_with_count || option.label;
      const queryText = option.query_text || option.label;
      const action = option.action || "search";

      chip.setAttribute("data-action", action);

      chip.innerHTML = `
        ${getSearchIcon({
          width: 14,
          height: 14,
          className: "me-agent-search-option-icon",
        })}
        <span class="me-agent-search-option-text">${displayLabel}</span>
      `;

      // On click, send the display label as the user message
      chip.addEventListener("click", () => onClick(displayLabel));

      optionsWrapper.appendChild(chip);
    });

    container.appendChild(optionsWrapper);
    return container;
  }
}
