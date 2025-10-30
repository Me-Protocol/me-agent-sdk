/**
 * SVG Icons for ME Agent SDK
 * Each icon function accepts optional width, height, and color parameters
 */
interface IconOptions {
    width?: string | number;
    height?: string | number;
    color?: string;
    className?: string;
}
/**
 * Main ME Agent Bot Icon (for the chat button)
 */
export declare function getBotIcon(options?: IconOptions): string;
/**
 * Close/X Icon (for close buttons)
 */
export declare function getCloseIcon(options?: IconOptions): string;
/**
 * Share Icon (for share button)
 */
export declare function getShareIcon(options?: IconOptions): string;
/**
 * Heart Icon (for like button - outlined)
 */
export declare function getHeartIcon(options?: IconOptions): string;
/**
 * Heart Icon (for like button - filled)
 */
export declare function getHeartFilledIcon(options?: IconOptions): string;
/**
 * Send/Arrow Icon (for send message button)
 */
export declare function getSendIcon(options?: IconOptions): string;
/**
 * Chevron/Arrow Back Icon (for back navigation)
 */
export declare function getChevronLeftIcon(options?: IconOptions): string;
/**
 * Chevron/Arrow Right Icon (for forward navigation)
 */
export declare function getChevronRightIcon(options?: IconOptions): string;
/**
 * Maximize/Expand Icon (for expanding the chat window)
 */
export declare function getMaximizeIcon(options?: IconOptions): string;
/**
 * Minimize Icon (for minimizing the chat window)
 */
export declare function getMinimizeIcon(options?: IconOptions): string;
/**
 * Loading/Spinner Icon (for loading states)
 */
export declare function getLoadingIcon(options?: IconOptions): string;
/**
 * Check/Success Icon (for success states)
 */
export declare function getCheckIcon(options?: IconOptions): string;
/**
 * Error/Alert Icon (for error states)
 */
export declare function getErrorIcon(options?: IconOptions): string;
/**
 * Gift/Rewards Icon (for rewards/offers)
 */
export declare function getGiftIcon(options?: IconOptions): string;
/**
 * User Avatar Icon (GitHub-style)
 */
export declare function getUserAvatarIcon(options?: IconOptions): string;
/**
 * Assistant Avatar Icon (Bot)
 */
export declare function getAssistantAvatarIcon(options?: IconOptions): string;
/**
 * Search Icon (for quick actions)
 */
export declare function getSearchIcon(options?: IconOptions): string;
/**
 * Sparkles Icon (for AI suggestions)
 */
export declare function getSparklesIcon(options?: IconOptions): string;
/**
 * Chat Icon (for chat title)
 */
export declare function getChatIcon(options?: IconOptions): string;
/**
 * Arrow Right Icon (for card list button)
 */
export declare function getArrowRightIcon(options?: IconOptions): string;
/**
 * User Icon (for "Sign up for a brand" action)
 */
export declare function getUserIcon(options?: IconOptions): string;
/**
 * Money Icon (for "Purchase from a brand" action)
 */
export declare function getMoneyIcon(options?: IconOptions): string;
/**
 * External link icon
 */
export declare function getExternalLinkIcon(options?: IconOptions): string;
/**
 * Award icon (for Must Haves category)
 */
export declare function getAwardIcon(options?: IconOptions): string;
/**
 * Shirt icon (for Cosmetics category)
 */
export declare function getShirtIcon(options?: IconOptions): string;
/**
 * Heart pulse icon (for Travel category)
 */
export declare function getHeartPulseIcon(options?: IconOptions): string;
/**
 * Sofa icon (for Sneakers category)
 */
export declare function getSofaIcon(options?: IconOptions): string;
/**
 * Tag icon (for Food & Beverages category)
 */
export declare function getTagIcon(options?: IconOptions): string;
/**
 * Layout grid icon (for Deals & Sports category)
 */
export declare function getLayoutGridIcon(options?: IconOptions): string;
/**
 * Laptop icon (for Gadgets & Electronics category)
 */
export declare function getLaptopIcon(options?: IconOptions): string;
/**
 * Book open icon (for Art & Collectibles category)
 */
export declare function getBookOpenIcon(options?: IconOptions): string;
/**
 * Back icon (alias for getChevronLeftIcon for backwards compatibility)
 */
export declare function getBackIcon(options?: IconOptions): string;
export {};
