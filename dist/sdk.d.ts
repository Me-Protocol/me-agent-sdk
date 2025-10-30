import { MeAgentConfig } from "./types";
/**
 * Main SDK Class
 */
export declare class MeAgentSDK {
    private config;
    private env;
    private sessionService;
    private messageParser;
    private redemptionService;
    private apiClient;
    private button;
    private chat;
    private devHelper;
    private initialized;
    private isOpen;
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
     * Destroy the SDK
     */
    destroy(): void;
}
