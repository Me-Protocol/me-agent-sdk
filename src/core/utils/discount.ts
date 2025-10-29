/**
 * Discount Utility
 * Calculates discounted prices based on redemption method
 */

import { RedemptionMethodType, DiscountDetails } from "../../types/offer";

export interface RedemptionMethodInput {
  type: RedemptionMethodType;
  discountPercentage?: number;
  discountAmount?: number;
  maxDiscountAmount?: number;
}

/**
 * Calculate the final discounted price based on redemption method
 */
export function getDiscountedPrice(
  originalPrice: number,
  method: RedemptionMethodInput
): number | string {
  switch (method.type) {
    case RedemptionMethodType.FREE_SHIPPING:
      return "Free shipping";

    case RedemptionMethodType.FIXED_AMOUNT_OFF: {
      const discount = Math.min(
        method.discountAmount || 0,
        method.maxDiscountAmount && method.maxDiscountAmount > 0
          ? method.maxDiscountAmount
          : Infinity
      );
      return originalPrice - discount;
    }

    case RedemptionMethodType.FIXED_PERCENTAGE_OFF: {
      const calculatedDiscount =
        originalPrice * ((method.discountPercentage || 0) / 100);
      const discount =
        method.maxDiscountAmount && method.maxDiscountAmount > 0
          ? Math.min(calculatedDiscount, method.maxDiscountAmount)
          : calculatedDiscount;
      return originalPrice - discount;
    }

    case RedemptionMethodType.VARIABLE_AMOUNT_OFF:
      // Variable amount uses discountAmount without max cap
      return originalPrice - (method.discountAmount || 0);

    case RedemptionMethodType.VARIABLE_PERCENTAGE_OFF: {
      const calculatedDiscount =
        originalPrice * ((method.discountPercentage || 0) / 100);
      const discount =
        method.maxDiscountAmount && method.maxDiscountAmount > 0
          ? Math.min(calculatedDiscount, method.maxDiscountAmount)
          : calculatedDiscount;
      return originalPrice - discount;
    }

    default:
      return originalPrice;
  }
}

/**
 * Calculate discount from offer data (from query_offers response)
 */
export function calculateOfferDiscount(
  originalPrice: number,
  discountType: string,
  discountDetails: DiscountDetails[]
): number | string {
  if (!discountDetails || discountDetails.length === 0) {
    return originalPrice;
  }

  const firstDiscount = discountDetails[0];

  const method: RedemptionMethodInput = {
    type: discountType as RedemptionMethodType,
    discountPercentage: firstDiscount.percentage,
    discountAmount: firstDiscount.amount,
  };

  return getDiscountedPrice(originalPrice, method);
}

/**
 * Format discount for display
 */
export function formatDiscount(
  discountType: string,
  discountDetails: DiscountDetails[]
): string {
  if (!discountDetails || discountDetails.length === 0) {
    return "";
  }

  const firstDiscount = discountDetails[0];

  switch (discountType) {
    case RedemptionMethodType.FIXED_PERCENTAGE_OFF:
    case RedemptionMethodType.VARIABLE_PERCENTAGE_OFF:
      return firstDiscount.percentage ? `${firstDiscount.percentage}% OFF` : "";

    case RedemptionMethodType.FIXED_AMOUNT_OFF:
    case RedemptionMethodType.VARIABLE_AMOUNT_OFF:
      return firstDiscount.amount ? `$${firstDiscount.amount} OFF` : "";

    case RedemptionMethodType.FREE_SHIPPING:
      return "FREE SHIPPING";

    default:
      return "";
  }
}
