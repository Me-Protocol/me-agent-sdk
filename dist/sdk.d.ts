import { MeAgentConfig } from "./types";
/**
 * Main SDK Class
 */
export declare class MeAgentSDK {
    private config;
    private env;
    private stateManager;
    private apiClient;
    private redeemManager;
    private button;
    private chat;
    private initialized;
    constructor(config: MeAgentConfig);
    /**
     * Validate configuration
     */
    private validateConfig;
    /**
     * Initialize the SDK
     */
    init(): Promise<void>;
    /**
     * Toggle chat open/closed
     */
    private toggleChat;
    /**
     * Send a message
     */
    private sendMessage;
    /**
     * Parse offers from function response
     */
    private parseOffers;
    /**
     * Parse brands from function response
     */
    private parseBrands;
    /**
     * Generate a unique ID
     */
    private generateId;
    /**
     * Destroy the SDK
     */
    destroy(): void;
}
