/**
 * Formatting Utilities
 * Pure helper functions for formatting numbers, currency, etc.
 */
/**
 * Format a number with thousand separators
 * @example formatNumber(3000) => "3,000"
 */
export declare function formatNumber(num: number): string;
/**
 * Format a price with 2 decimal places
 * @example formatPrice(19.99) => "$19.99"
 */
export declare function formatPrice(price: number): string;
/**
 * Calculate discounted price
 * @example calculateDiscountedPrice(100, 20) => 80
 */
export declare function calculateDiscountedPrice(price: number, discountPercentage: number): number;
/**
 * Generate a unique ID
 * @example generateId() => "1234567890-abc123def"
 */
export declare function generateId(): string;
/**
 * Generate a UUID v4
 */
export declare function generateUUID(): string;
