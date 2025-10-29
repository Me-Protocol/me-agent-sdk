/**
 * Category Grid View
 * Renders a grid of purchase earning categories
 */
import { Category } from "../../types";
export declare class CategoryGridView {
    /**
     * Render category grid
     */
    render(categories: Category[]): string;
    /**
     * Render a single category card
     */
    private renderCategoryCard;
    /**
     * Get category icon SVG (from Lucide React icons)
     */
    private getCategoryIcon;
}
