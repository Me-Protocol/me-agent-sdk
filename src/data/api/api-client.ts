/**
 * Unified API Client
 * Combines all domain-specific API clients into a single facade
 */

import { MeAgentConfig, EnvConfig } from "../../types";
import { SessionAPI } from "./session-api";
import { ChatAPI } from "./chat-api";
import { OfferAPI } from "./offer-api";
import { BrandAPI } from "./brand-api";
import { RewardAPI } from "./reward-api";
import { AuthAPI } from "./auth-api";

/**
 * Main API Client - Facade for all domain APIs
 */
export class APIClient {
  // Domain-specific APIs
  private _sessionAPI: SessionAPI;
  private _chatAPI: ChatAPI;
  private _offerAPI: OfferAPI;
  private _brandAPI: BrandAPI;
  private _rewardAPI: RewardAPI;
  private _authAPI: AuthAPI;

  constructor(config: MeAgentConfig, env: EnvConfig) {
    // Initialize all domain APIs
    this._sessionAPI = new SessionAPI(config, env);
    this._chatAPI = new ChatAPI(config, env);
    this._offerAPI = new OfferAPI(config, env);
    this._brandAPI = new BrandAPI(config, env);
    this._rewardAPI = new RewardAPI(config, env);
    this._authAPI = new AuthAPI(config, env);
  }

  // ===== API Access (for services) =====
  get brandAPI(): BrandAPI {
    return this._brandAPI;
  }

  get offerAPI(): OfferAPI {
    return this._offerAPI;
  }

  // ===== User Info =====
  getUserEmail(): string | undefined {
    return this._sessionAPI.getUserEmail();
  }

  getUserId(): string {
    return this._sessionAPI.getUserId();
  }

  // ===== Session Management =====
  async createSession(): Promise<string> {
    return this._sessionAPI.createSession();
  }

  // ===== Chat & Messaging =====
  async sendMessage(
    sessionId: string,
    message: string,
    onChunk: (chunk: string, rawData?: any) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    return this._chatAPI.sendMessage(
      sessionId,
      message,
      onChunk,
      onComplete,
      onError
    );
  }

  // ===== Offers =====
  async fetchOfferDetails(offerCode: string, sessionId: string) {
    return this._offerAPI.fetchOfferDetails(offerCode, sessionId);
  }

  async fetchOffersByBrandId(brandId: string, token?: string) {
    return this._offerAPI.fetchOffersByBrandId(brandId, token);
  }

  // ===== Brands =====
  async fetchBrandsByCategoryId(categoryId: string) {
    return this._brandAPI.fetchBrandsByCategoryId(categoryId);
  }

  // ===== Rewards & Redemption =====
  async fetchRewardBalances(walletAddress: string, token: string) {
    return this._rewardAPI.fetchRewardBalances(walletAddress, token);
  }

  async fetchSwapAmount(payload: any, token: string) {
    return this._rewardAPI.fetchSwapAmount(payload, token);
  }

  // ===== Authentication =====
  async meProtocolLogin(email: string, walletAddress: string) {
    return this._authAPI.meProtocolLogin(email, walletAddress);
  }
}
