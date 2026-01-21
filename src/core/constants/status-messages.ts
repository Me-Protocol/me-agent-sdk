/**
 * Status Message Configuration
 *
 * Phrase pools for dynamic, context-aware status messages
 * during AI processing. Messages are randomly selected and
 * templates are filled with context (query, count, etc.)
 */

export interface StatusMessageConfig {
  started: string[];
  tool_call: Record<string, string[]>;
  results_found: string[];
  error: string[];
  fallback: string[];
}

/**
 * Template placeholders:
 * - {query} : The user's search query
 * - {count} : Number of results found
 * - {tool}  : Name of the tool being used
 */
export const STATUS_MESSAGES: StatusMessageConfig = {
  // When search/processing starts
  started: [
    "Searching for {query}...",
    "Finding {query} for you...",
    "Looking for the best {query}...",
    "On it! Searching {query}...",
    "Let me find {query}...",
    "Hunting for {query}...",
    "Browsing {query}...",
  ],

  // Tool-specific messages (nested by tool name)
  tool_call: {
    query_offers: [
      "Browsing deals...",
      "Checking available offers...",
      "Finding the best discounts...",
      "Searching through offers...",
      "Looking for great deals...",
    ],
    query_products: [
      "Searching products...",
      "Browsing our catalog...",
      "Finding products...",
      "Checking inventory...",
      "Looking through products...",
    ],
    get_categories: [
      "Loading categories...",
      "Getting what's available...",
      "Fetching categories...",
    ],
    get_signup_earning_brands: [
      "Finding brands with rewards...",
      "Checking earning opportunities...",
      "Looking for reward brands...",
    ],
    ways_to_earn: [
      "Finding ways to earn...",
      "Checking reward options...",
      "Loading earning methods...",
    ],
    get_reward_details: [
      "Getting your rewards...",
      "Checking reward balance...",
      "Loading reward details...",
    ],
    get_category_purchase_earning: [
      "Finding category rewards...",
      "Checking earning rates...",
    ],
    redirect_to_signup_page: [
      "Preparing signup...",
      "Getting you signed up...",
    ],
    redirect_to_store_page: [
      "Opening store...",
      "Taking you there...",
    ],
  },

  // When results are found
  results_found: [
    "Found {count} great options!",
    "{count} matches found!",
    "Got {count} results!",
    "Here's what I found!",
    "Found {count} items for you!",
    "Success! {count} options available.",
    "{count} products found!",
  ],

  // Error states
  error: [
    "Oops, something went wrong...",
    "Let me try that again...",
    "Having trouble, one moment...",
  ],

  // Fallback when no context available
  fallback: [
    "Working on it...",
    "Just a moment...",
    "Processing...",
    "Almost there...",
    "Searching...",
  ],
};

/**
 * Generic fallback messages when query context is missing
 */
export const GENERIC_STARTED_MESSAGES: string[] = [
  "Searching...",
  "Looking for options...",
  "Finding what you need...",
  "On it...",
  "Let me check...",
];

/**
 * Messages for zero results scenario
 */
export const ZERO_RESULTS_MESSAGES: string[] = [
  "No exact matches found",
  "Couldn't find that specific item",
  "Nothing matched your search",
];
