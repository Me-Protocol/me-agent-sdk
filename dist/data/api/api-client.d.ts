/**
 * Unified API Client
 * Combines all domain-specific API clients into a single facade
 */
import { MeAgentConfig, EnvConfig } from "../../types";
import { OfferAPI } from "./offer-api";
import { BrandAPI } from "./brand-api";
import { RedemptionAPI } from "./redemption-api";
/**
 * Main API Client - Facade for all domain APIs
 */
export declare class APIClient {
    private _sessionAPI;
    private _chatAPI;
    private _offerAPI;
    private _brandAPI;
    private _rewardAPI;
    private _authAPI;
    private _redemptionAPI;
    constructor(config: MeAgentConfig, env: EnvConfig);
    get brandAPI(): BrandAPI;
    get offerAPI(): OfferAPI;
    get redemptionAPI(): RedemptionAPI;
    getUserEmail(): string | undefined;
    getUserId(): string;
    createSession(): Promise<string>;
    sendMessage(sessionId: string, message: string, onChunk: (chunk: string, rawData?: any) => void, onComplete: () => void, onError: (error: Error) => void): Promise<void>;
    fetchOfferDetails(offerCode: string, sessionId: string): Promise<import("../../types").OfferDetail>;
    fetchOffersByBrandId(brandId: string, token?: string): Promise<any[]>;
    fetchBrandsByCategoryId(categoryId: string): Promise<any[]>;
    fetchRewardBalances(walletAddress: string, token: string): Promise<any[]>;
    fetchSwapAmount(payload: any, token: string): Promise<import("../../types").SwapAmountResponse>;
    meProtocolLogin(email: string, walletAddress: string): Promise<import("../../types").MELoginResponse>;
}
