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

export class MagicClient {
  private magic: any = null;
  private initialized = false;
  private config: MagicConfig;

  constructor(config: MagicConfig) {
    this.config = config;
  }

  /**
   * Initialize Magic SDK
   * Loads the Magic SDK from CDN if not already loaded
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Load Magic SDK from CDN if not already loaded
    if (!window.Magic) {
      await this.loadMagicSDK();
    }

    // Initialize Magic instance with network configuration
    this.magic = new window.Magic(this.config.apiKey, {
      network: {
        rpcUrl: this.config.rpcUrl,
        chainId: parseInt(this.config.chainId),
      },
    });
    this.initialized = true;
  }

  /**
   * Load Magic SDK from CDN
   */
  private loadMagicSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Magic) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://auth.magic.link/sdk";
      script.async = true;
      script.onload = () => {
        // Wait a bit for Magic to be available
        setTimeout(() => resolve(), 100);
      };
      script.onerror = () => reject(new Error("Failed to load Magic SDK"));
      document.head.appendChild(script);
    });
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    if (!this.initialized) {
      await this.init();
    }

    try {
      return await this.magic.user.isLoggedIn();
    } catch (error) {
      console.error("Error checking Magic login status:", error);
      return false;
    }
  }

  /**
   * Get user metadata (including wallet address)
   */
  async getUserMetadata(): Promise<{
    publicAddress: string;
    email: string | null;
  }> {
    if (!this.initialized) {
      await this.init();
    }

    try {
      // Magic SDK uses getInfo() method, not getMetadata()
      const metadata = await this.magic.user.getInfo();

      // Extract wallet address from the wallets object
      const publicAddress = metadata?.wallets?.ethereum?.publicAddress;

      if (!publicAddress) {
        console.error(
          "Failed to extract wallet address from metadata:",
          metadata
        );
        throw new Error(
          "Magic returned invalid user metadata - no Ethereum wallet address found"
        );
      }

      return {
        publicAddress,
        email: metadata.email || null,
      };
    } catch (error) {
      console.error("Error getting Magic user metadata:", error);
      throw error;
    }
  }

  /**
   * Login with email OTP
   */
  async loginWithEmailOTP(email: string): Promise<string> {
    if (!this.initialized) {
      await this.init();
    }

    try {
      // Magic SDK v11+ uses loginWithEmailOTP directly on auth
      const didToken = await this.magic.auth.loginWithEmailOTP({
        email,
        showUI: true, // Show Magic's UI for OTP entry
      });
      return didToken;
    } catch (error) {
      console.error("Error logging in with Magic:", error);
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      await this.magic.user.logout();
    } catch (error) {
      console.error("Error logging out from Magic:", error);
      throw error;
    }
  }

  /**
   * Get wallet address (shortcut method)
   */
  async getWalletAddress(): Promise<string> {
    const metadata = await this.getUserMetadata();
    return metadata.publicAddress;
  }

  /**
   * Get Web3 provider for signing transactions
   */
  async getProvider(): Promise<any> {
    if (!this.initialized) {
      await this.init();
    }

    return this.magic.rpcProvider;
  }

  /**
   * Get the Magic instance (for advanced usage)
   */
  getMagicInstance(): any {
    return this.magic;
  }
}
