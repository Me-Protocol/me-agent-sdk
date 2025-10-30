/**
 * Redemption API
 * Handles transaction, order processing, and checkout endpoints
 */
import { BaseAPI } from "./base-api";
import { PushTransactionPayload, PushTransactionResponse, ProcessOrderPayload, ProcessOrderResponse, CheckoutUrlPayload, RefundTaskPayload } from "../../types";
export declare class RedemptionAPI extends BaseAPI {
    /**
     * Push signed transaction to runtime
     */
    pushTransaction(payload: PushTransactionPayload, token: string): Promise<PushTransactionResponse>;
    /**
     * Process order after successful transaction
     */
    processOrder(payload: ProcessOrderPayload, token: string): Promise<ProcessOrderResponse>;
    /**
     * Generate Shopify checkout URL with discount code
     */
    getCheckoutUrl(payload: CheckoutUrlPayload, token: string): Promise<string>;
    /**
     * Refund task if transaction fails
     */
    refundTask(payload: RefundTaskPayload, token: string): Promise<void>;
}
