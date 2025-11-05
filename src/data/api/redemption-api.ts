/**
 * Redemption API
 * Handles transaction, order processing, and checkout endpoints
 */

import { BaseAPI } from "./base-api";
import {
  PushTransactionPayload,
  PushTransactionResponse,
  ProcessOrderPayload,
  ProcessOrderResponse,
  CheckoutUrlPayload,
  CheckoutUrlResponse,
  RefundTaskPayload,
} from "../../types";

export class RedemptionAPI extends BaseAPI {
  /**
   * Push signed transaction to runtime
   */
  async pushTransaction(
    payload: PushTransactionPayload,
    token: string
  ): Promise<PushTransactionResponse> {
    try {
      const result = await this.post<{ data: PushTransactionResponse }>(
        `${this.env.API_URL}runtime/push-transaction`,
        payload,
        { "x-access-token": token }
      );
      return result.data;
    } catch (error) {
      console.error("Error pushing transaction:", error);
      throw error;
    }
  }

  /**
   * Process order after successful transaction
   */
  async processOrder(
    payload: ProcessOrderPayload,
    token: string
  ): Promise<ProcessOrderResponse> {
    try {
      const result = await this.post<{ data: ProcessOrderResponse }>(
        `${this.env.API_URL}orders/process-order`,
        payload,
        { "x-access-token": token }
      );
      return result.data;
    } catch (error) {
      console.error("Error processing order:", error);
      throw error;
    }
  }

  /**
   * Generate Shopify checkout URL with discount code
   */
  async getCheckoutUrl(
    payload: CheckoutUrlPayload,
    token: string
  ): Promise<string> {
    try {
      const result = await this.post<{ data: CheckoutUrlResponse }>(
        `${this.env.API_V1_URL}order/shopify/checkout-url`,
        payload,
        { Authorization: `Bearer ${token}` }
      );
      return result.data.url;
    } catch (error) {
      console.error("Error getting checkout URL:", error);
      throw error;
    }
  }

  /**
   * Refund task if transaction fails
   */
  async refundTask(payload: RefundTaskPayload, token: string): Promise<void> {
    try {
      await this.post(`${this.env.API_URL}runtime/refund-task`, payload, {
        "x-access-token": token,
      });
    } catch (error) {
      console.error("Error refunding task:", error);
      throw error;
    }
  }
}
