/**
 * HTML Builder Utilities
 * Functions for building HTML strings for UI components
 */
import { Offer, Brand, Category } from "../../types";
/**
 * Build HTML for an offer card in the grid view
 */
export declare function buildOfferCard(offer: Offer): string;
/**
 * Build HTML for a brand offer card (used in brand offers list)
 */
export declare function buildBrandOfferCard(offer: any): string;
/**
 * Build HTML for a brand card in the brand list
 */
export declare function buildBrandCard(brand: Brand): string;
/**
 * Build HTML for a brand with horizontal offers list
 */
export declare function buildBrandWithOffersCard(brand: any): string;
/**
 * Build HTML for a category card
 */
export declare function buildCategoryCard(category: Category): string;
