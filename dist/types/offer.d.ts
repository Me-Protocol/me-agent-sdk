/**
 * Offer Types
 * All types related to offers and products
 */
/**
 * Redemption method types
 */
export declare enum RedemptionMethodType {
    FIXED_AMOUNT_OFF = "FIXED_AMOUNT_OFF",
    FIXED_PERCENTAGE_OFF = "FIXED_PERCENTAGE_OFF",
    VARIABLE_AMOUNT_OFF = "VARIABLE_AMOUNT_OFF",
    VARIABLE_PERCENTAGE_OFF = "VARIABLE_PERCENTAGE_OFF",
    FREE_SHIPPING = "FREE_SHIPPING"
}
/**
 * Discount details structure
 */
export interface DiscountDetails {
    percentage?: number;
    amount?: number;
}
/**
 * Offer data structure (simplified list view)
 */
export interface Offer {
    id: string;
    name: string;
    offerCode: string;
    price: number;
    description: string;
    discountType: string;
    discountDetails: DiscountDetails[];
    brandName: string;
    image?: string;
    websiteUrl?: string;
    productUrl?: string;
}
/**
 * Offer variant type
 */
export interface OfferVariant {
    id: string;
    offerId: string;
    totalInventory: number;
    inventory: number;
    discountPercentage: string;
    rewardValue: string;
    offerCode: string;
    variantId: string;
    variant: {
        id: string;
        name: string;
        price: string;
        description: string | null;
        inventory: number;
        productImages: Array<{
            url: string;
        }>;
        options?: Array<{
            name: string;
            value: string;
        }>;
    };
}
/**
 * Offer detail response (full product details)
 */
export interface OfferDetail {
    id: string;
    name: string;
    description: string;
    originalPrice: string;
    discountPercentage: string;
    offerCode: string;
    coverImage: string;
    brand: {
        id: string;
        name: string;
        logo: string;
        network: string;
    };
    redemptionMethod: {
        id: string;
        type: string;
        discountPercentage: string;
        discountAmount?: string;
    };
    reward: {
        id: string;
        contractAddress: string;
        rewardImage: string;
        rewardName: string;
        rewardSymbol: string;
    };
    offerImages: Array<{
        url: string;
    }>;
    offerVariants?: OfferVariant[];
}
