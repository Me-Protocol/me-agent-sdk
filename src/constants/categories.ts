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
  // Map to backend category names
  categoryNames: string[];
}

export const PRESET_CATEGORIES: CategoryPreset[] = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589166/cate-1_qizn7y.png",
    title: "Must Haves",
    icon: "award",
    description: "Essential products you shouldn't miss",
    categoryNames: ["Must Haves", "Essentials"],
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589166/cate7_tbhw5u.png",
    title: "Cosmetics",
    icon: "shirt",
    description: "Beauty and personal care products",
    categoryNames: ["Cosmetics", "Beauty"],
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589167/cate2_gtjck8.png",
    title: "Travel &\nExperiences",
    icon: "heartPulse",
    description: "Destinations and unforgettable moments",
    categoryNames: ["Travel", "Experiences", "Travel & Experiences"],
  },
  {
    id: 6,
    image:
      "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589167/cate-4_uxqxqx.png",
    title: "Sneakers",
    icon: "sofa",
    description: "Stylish footwear for all occasions",
    categoryNames: ["Sneakers", "Shoes", "Footwear"],
  },
  {
    id: 7,
    image:
      "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589167/cate-5_zxqxqx.png",
    title: "Food &\nBeverages",
    icon: "tag",
    description: "Culinary delights and refreshments",
    categoryNames: [
      "Food",
      "Beverages",
      "Food & Beverages",
      "Food and beverages",
    ],
  },
  {
    id: 8,
    image:
      "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589168/cate-3_sports.png",
    title: "Deals &\nSports",
    icon: "layoutGrid",
    description: "Sporting goods and special offers",
    categoryNames: ["Sports", "Sport deals", "Deals"],
  },
  {
    id: 5,
    image:
      "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589167/cate-6_pfxfbq.png",
    title: "Gadgets &\nElectronics",
    icon: "laptop",
    description: "Tech products and accessories",
    categoryNames: ["Electronics", "Gadgets", "Tech"],
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589168/cate-8_s6yf5z.png",
    title: "Art &\nCollectibles",
    icon: "bookOpen",
    description: "Unique items for collectors",
    categoryNames: ["Art", "Collectibles", "Art & Collectibles"],
  },
];

/**
 * Get preset category by category name from backend
 */
export function getCategoryPreset(
  categoryName: string
): CategoryPreset | undefined {
  return PRESET_CATEGORIES.find((preset) =>
    preset.categoryNames.some(
      (name) => name.toLowerCase() === categoryName.toLowerCase()
    )
  );
}

/**
 * Merge backend categories with presets
 */
export function mergeCategoriesWithPresets(
  backendCategories: Array<{
    categoryId: string;
    categoryName: string;
    brandCount: number;
  }>
): Array<{
  categoryId: string;
  categoryName: string;
  brandCount: number;
  image?: string;
  title?: string;
  icon?: string;
  description?: string;
}> {
  return backendCategories.map((category) => {
    const preset = getCategoryPreset(category.categoryName);
    if (preset) {
      return {
        ...category,
        image: preset.image,
        title: preset.title,
        icon: preset.icon,
        description: preset.description,
      };
    }
    return category;
  });
}
