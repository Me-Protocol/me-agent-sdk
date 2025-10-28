import { MeAgentConfig, OfferDetail, MELoginResponse, SwapAmountPayload, SwapAmountResponse } from "../types";
import { EnvConfig } from "../config/env";
/**
 * API Client - Handles communication with backend
 */
export declare class APIClient {
    private config;
    private env;
    private userId;
    constructor(config: MeAgentConfig, env: EnvConfig);
    /**
     * Get user email from config
     */
    getUserEmail(): string | undefined;
    /**
     * Generate a UUID v4
     */
    private generateUUID;
    /**
     * Create a new session
     */
    createSession(): Promise<string>;
    /**
     * Send a message and handle streaming response
     */
    sendMessage(sessionId: string, message: string, onChunk: (chunk: string, rawData?: any) => void, onComplete: () => void, onError: (error: Error) => void): Promise<void>;
    /**
     * Fetch offer details
     */
    fetchOfferDetails(offerCode: string, sessionId: string): Promise<OfferDetail>;
    /**
     * Fetch user reward balances
     */
    fetchRewardBalances(walletAddress: string, token: string): Promise<any[]>;
    /**
     * Fetch swap amount needed for redemption
     */
    fetchSwapAmount(payload: SwapAmountPayload, token: string): Promise<SwapAmountResponse>;
    /**
     * Login to ME Protocol (creates account if new user)
     */
    meProtocolLogin(email: string, walletAddress: string): Promise<MELoginResponse>;
    /**
     * Fetch brands by category ID with purchase earning methods
     */
    fetchBrandsByCategoryId(categoryId: string): Promise<any[]>;
    /**
     * Fetch offers by brand ID
     */
    fetchOffersByBrandId(brandId: string, token?: string): Promise<any[]>;
}
