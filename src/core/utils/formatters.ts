/**
 * Formatting Utilities
 * Pure helper functions for formatting numbers, currency, etc.
 */

/**
 * Format a number with thousand separators
 * @example formatNumber(3000) => "3,000"
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format a price with 2 decimal places
 * @example formatPrice(19.99) => "$19.99"
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculate discounted price
 * @example calculateDiscountedPrice(100, 20) => 80
 */
export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number
): number {
  return price * (1 - discountPercentage / 100);
}

/**
 * Generate a unique ID
 * @example generateId() => "1234567890-abc123def"
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
