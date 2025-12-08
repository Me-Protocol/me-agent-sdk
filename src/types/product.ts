/**
 * Product Type Definitions
 */

export interface ProductDiscount {
  percentage: number | null;
  amount: number | null;
}

export interface Product {
  product_id: string;
  product_name: string;
  brand_name: string;
  description: string;
  price: number;
  discounts: ProductDiscount[];
  brand_shopify_url: string;
  productUrl: string;
  coverImage: string;
}

