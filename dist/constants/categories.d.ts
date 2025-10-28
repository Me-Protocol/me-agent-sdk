/**
 * Preset categories with images and icons
 * Maps category names to their visual assets
 */
export interface CategoryPreset {
    id: number;
    image: string;
    title: string;
    icon: string;
    description: string;
    categoryNames: string[];
}
export declare const PRESET_CATEGORIES: CategoryPreset[];
/**
 * Get preset category by category name from backend
 */
export declare function getCategoryPreset(categoryName: string): CategoryPreset | undefined;
/**
 * Merge backend categories with presets
 */
export declare function mergeCategoriesWithPresets(backendCategories: Array<{
    categoryId: string;
    categoryName: string;
    brandCount: number;
}>): Array<{
    categoryId: string;
    categoryName: string;
    brandCount: number;
    image?: string;
    title?: string;
    icon?: string;
    description?: string;
}>;
