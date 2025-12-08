import { Product } from "../../types";
import { CardList, CardListItem } from "./card-list";

/**
 * Product Preview Card - Shows products in chat after AI response
 * Uses the generic CardList component
 */
export class ProductPreviewCard {
  /**
   * Create product preview card element
   */
  static create(
    products: Product[],
    onViewProducts: (products: Product[]) => void
  ): HTMLDivElement {
    // Convert products to card list items
    const items: CardListItem[] = products.map((product) => ({
      id: product.product_id,
      image: product.coverImage,
      title: product.product_name,
      subtitle: product.brand_name,
    }));

    // Use the generic CardList component
    return CardList.create({
      items,
      title: `Found ${products.length} ${
        products.length === 1 ? "product" : "products"
      } for you`,
      actionLabel: "View products",
      onAction: () => onViewProducts(products),
    });
  }
}

