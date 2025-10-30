/**
 * Magic Link Client Wrapper
 * Handles authentication and wallet operations
 */
declare global {
    interface Window {
        Magic: any;
    }
}
export interface MagicConfig {
    apiKey: string;
    chainId: string;
    rpcUrl: string;
}
export declare class MagicClient {
    private magic;
    private initialized;
    private config;
    constructor(config: MagicConfig);
    /**
     * Initialize Magic SDK
     * Loads the Magic SDK from CDN if not already loaded
     */
    init(): Promise<void>;
    /**
     * Load Magic SDK from CDN
     */
    private loadMagicSDK;
    /**
     * Check if user is logged in
     */
    isLoggedIn(): Promise<boolean>;
    /**
     * Get user metadata (including wallet address)
     */
    getUserMetadata(): Promise<{
        publicAddress: string;
        email: string | null;
    }>;
    /**
     * Login with email OTP
     */
    loginWithEmailOTP(email: string): Promise<string>;
    /**
     * Logout
     */
    logout(): Promise<void>;
    /**
     * Get wallet address (shortcut method)
     */
    getWalletAddress(): Promise<string>;
    /**
     * Get Web3 provider for signing transactions
     */
    getProvider(): Promise<any>;
    /**
     * Get the Magic instance (for advanced usage)
     */
    getMagicInstance(): any;
}
