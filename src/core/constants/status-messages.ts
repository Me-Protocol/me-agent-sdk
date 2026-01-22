/**
 * Status Message Configuration
 *
 * Phrase pools for dynamic, context-aware status messages
 * during AI processing. Messages are randomly selected and
 * templates are filled with context (query, count, etc.)
 */

export interface StatusMessageConfig {
  started: Record<string, string[]>;
  tool_call: Record<string, string[]>;
  results_found: string[];
  error: string[];
  fallback: string[];
}

/**
 * Intent detection keywords
 */
export const INTENT_KEYWORDS = {
  greeting: ["hi", "hello", "hey", "howdy", "hiya", "sup", "yo", "good morning", "good afternoon", "good evening", "greetings"],
  question: ["what", "how", "why", "when", "where", "which", "who", "can you", "could you", "would you", "is there", "are there", "do you", "does"],
  search: ["find", "search", "show", "looking for", "look for", "get me", "i need", "i want", "browse", "shop for", "buy"],
  help: ["help", "assist", "support", "guide", "explain", "tell me about"],
  surprise: ["surprise", "random", "anything", "whatever", "recommend", "suggest", "pick for me"],
};

/**
 * Detect intent from user query
 */
export function detectIntent(query: string): string {
  const lowerQuery = query.toLowerCase().trim();

  // Check greetings first (exact or starts with)
  for (const keyword of INTENT_KEYWORDS.greeting) {
    if (lowerQuery === keyword || lowerQuery.startsWith(keyword + " ") || lowerQuery.startsWith(keyword + "!") || lowerQuery.startsWith(keyword + ",")) {
      return "greeting";
    }
  }

  // Check questions (starts with)
  for (const keyword of INTENT_KEYWORDS.question) {
    if (lowerQuery.startsWith(keyword + " ") || lowerQuery.startsWith(keyword + "?")) {
      return "question";
    }
  }

  // Check help
  for (const keyword of INTENT_KEYWORDS.help) {
    if (lowerQuery.includes(keyword)) {
      return "help";
    }
  }

  // Check surprise/random
  for (const keyword of INTENT_KEYWORDS.surprise) {
    if (lowerQuery.includes(keyword)) {
      return "surprise";
    }
  }

  // Check search intent
  for (const keyword of INTENT_KEYWORDS.search) {
    if (lowerQuery.includes(keyword)) {
      return "search";
    }
  }

  // Default to search for anything else
  return "default";
}

/**
 * Template placeholders:
 * - {query} : The user's search query
 * - {count} : Number of results found
 * - {tool}  : Name of the tool being used
 */
export const STATUS_MESSAGES: StatusMessageConfig = {
  // Intent-based started messages
  started: {
    greeting: [
      "Hey there!",
      "Hi!",
      "Hello!",
      "Hey!",
      "Hi there!",
      "Hello there!",
      "Hey, hi!",
      "Hiya!",
      "What's up!",
      "Howdy!",
      "Nice to see you!",
      "Welcome!",
      "Good to see you!",
      "Hey, how's it going!",
      "Hi, friend!",
      "Hello, hello!",
      "Hey there, hi!",
      "Well hello!",
      "Oh hey!",
      "Yo!",
    ],
    question: [
      "Good question...",
      "Let me think...",
      "Hmm, let me see...",
      "Great question!",
      "Let me check on that...",
      "Interesting question...",
      "Let me find out...",
      "Thinking...",
      "Let me look into that...",
      "One moment...",
      "Let me see here...",
      "Checking on that...",
      "Let me figure that out...",
      "Good one...",
      "Hmm...",
      "Let me dig into that...",
      "Interesting...",
      "Let me help with that...",
      "Ah, let me check...",
      "Ooh, let me see...",
    ],
    search: [
      "Looking...",
      "Searching...",
      "On it!",
      "Let me find that...",
      "Searching now...",
      "Looking for that...",
      "Finding that for you...",
      "Let me look...",
      "Hunting for that...",
      "Browsing...",
      "Let me search...",
      "Looking that up...",
      "On the hunt!",
      "Searching away...",
      "Let me dig in...",
      "Looking around...",
      "Checking our catalog...",
      "Browsing for you...",
      "Scouting...",
      "On the case!",
    ],
    help: [
      "Happy to help!",
      "I can help with that!",
      "Sure, let me help...",
      "Of course!",
      "Absolutely!",
      "I'm here to help!",
      "Let me assist...",
      "I've got you!",
      "No problem!",
      "Sure thing!",
      "I'm on it!",
      "Let me guide you...",
      "Happy to assist!",
      "Here to help!",
      "I can do that!",
      "Let me help out...",
      "Glad to help!",
      "Let's figure this out...",
      "I'll help with that...",
      "Right away!",
    ],
    surprise: [
      "Ooh, fun!",
      "Let's see...",
      "I love surprises!",
      "Picking something good...",
      "Let me find something cool...",
      "Hmm, how about...",
      "Let's get creative!",
      "Surprise coming up!",
      "Let me pick something...",
      "Something special...",
      "One surprise coming up!",
      "Let's see what we've got...",
      "Finding something fun...",
      "Ooh, let me pick...",
      "Random time!",
      "Let me surprise you...",
      "Grabbing something good...",
      "Finding a gem...",
      "Let's discover...",
      "Adventure time!",
    ],
    default: [
      "On it!",
      "Got it!",
      "Sure thing!",
      "Let me check...",
      "Looking...",
      "One moment...",
      "Right away!",
      "Let me see...",
      "Checking now...",
      "On the case!",
      "Coming right up!",
      "Let me look...",
      "One sec...",
      "Working on it...",
      "Just a sec...",
      "Alright!",
      "You got it!",
      "Let's see...",
      "Hang tight...",
      "Sure!",
    ],
  },

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
 * (Now same as started since we use punchy acknowledgments)
 */
export const GENERIC_STARTED_MESSAGES: string[] = [
  "On it!",
  "Got it!",
  "Looking...",
  "Let me check...",
  "One moment...",
];

/**
 * Messages for zero results scenario
 */
export const ZERO_RESULTS_MESSAGES: string[] = [
  "No exact matches found",
  "Couldn't find that specific item",
  "Nothing matched your search",
];
