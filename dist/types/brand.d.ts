/**
 * Brand & Category Types
 * All types related to brands and earning categories
 */
/**
 * Brand type for signup earning
 */
export interface Brand {
    id: string;
    name: string;
    logoUrl: string | null;
    description: string | null;
    websiteUrl: string | null;
    shopifyStoreUrl: string | null;
    network: string;
    categoryId: string;
    categoryName: string;
    rewardDetails: {
        earningMethodId: string;
        earningType: string;
        isActive: boolean;
        rewardExistingCustomers: boolean;
        rewardInfo: {
            id: string;
            rewardName: string;
            rewardSymbol: string;
            rewardImage: string;
            rewardValueInDollars: string;
            rewardOriginalValue: string;
            currency?: string;
        };
        rules: Array<{
            id: string;
            points: number;
            earningPercentage: number;
            isRepeatable: boolean;
            minimumValue: number | null;
        }>;
    };
}
/**
 * Category type for purchase earning
 */
export interface Category {
    categoryId: string;
    categoryName: string;
    brandCount: number;
    image?: string;
    title?: string;
    icon?: string;
    description?: string;
}
