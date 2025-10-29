/**
 * Chat View Utilities
 * Helper functions for rendering chat UI elements
 */
import { Offer, Brand, Category, QuickAction } from "../../types";
/**
 * Create offer preview card list
 */
export declare function createOfferPreview(offers: Offer[], onViewAll: () => void): HTMLElement;
/**
 * Create brand preview card list
 */
export declare function createBrandPreview(brands: Brand[], onViewAll: () => void): HTMLElement;
/**
 * Create category preview card list
 */
export declare function createCategoryPreview(categories: Category[], onViewAll: () => void): HTMLElement;
/**
 * Create ways to earn quick actions
 */
export declare function createWaysToEarnActions(onAction: (action: QuickAction) => void): HTMLElement;
/**
 * Append element to the last assistant message
 */
export declare function appendToLastMessage(messagesContainer: HTMLElement, element: HTMLElement): void;
