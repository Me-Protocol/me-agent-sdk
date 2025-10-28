import { MeAgentConfig, Message, Offer, Brand, Category } from "./types";
import { mergeCategoriesWithPresets } from "./constants/categories";
import { StateManager } from "./state/manager";
import { APIClient } from "./api/client";
import { FloatingButton } from "./ui/button";
import { ChatPopup } from "./ui/chat";
import { injectStyles } from "./ui/styles";
import { RedeemManager } from "./redeem/manager";
import { getEnv, SupportedNetwork, Environment, EnvConfig } from "./config/env";

/**
 * Main SDK Class
 */
export class MeAgentSDK {
  private config: MeAgentConfig;
  private env: EnvConfig;
  private stateManager: StateManager;
  private apiClient: APIClient;
  private redeemManager: RedeemManager | null = null;
  private button: FloatingButton | null = null;
  private chat: ChatPopup | null = null;
  private initialized = false;

  constructor(config: MeAgentConfig) {
    this.validateConfig(config);
    this.config = {
      position: "bottom-right",
      environment: Environment.DEV,
      network: SupportedNetwork.SEPOLIA,
      ...config,
    };

    // Get environment configuration based on environment and network
    this.env = getEnv(this.config.environment, this.config.network);

    this.stateManager = new StateManager();
    this.apiClient = new APIClient(this.config, this.env);

    // Initialize RedeemManager with network-specific configuration
    this.redeemManager = new RedeemManager(
      this.apiClient,
      {
        apiKey: this.env.MAGIC_PUBLISHABLE_API_KEY,
        chainId: this.env.CHAIN_ID,
        rpcUrl: this.env.RPC_URL,
      },
      this.env.OPEN_REWARD_DIAMOND
    );
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: MeAgentConfig): void {
    // No required fields currently
  }

  /**
   * Initialize the SDK
   */
  async init(): Promise<void> {
    if (this.initialized) {
      console.warn("MeAgent SDK: Already initialized");
      return;
    }

    try {
      // Inject styles
      injectStyles();

      // Create session
      const sessionId = await this.apiClient.createSession();
      this.stateManager.setSessionId(sessionId);

      // Initialize UI components
      this.button = new FloatingButton(
        this.config.position || "bottom-right",
        () => this.toggleChat()
      );

      this.chat = new ChatPopup(
        this.config.position || "bottom-right",
        (message) => this.sendMessage(message),
        () => this.toggleChat(),
        this.apiClient,
        sessionId,
        this.config,
        this.redeemManager || undefined
      );

      // Mount components
      this.button.mount();
      this.chat.mount();

      // Show welcome message
      this.chat.showWelcome();

      // Subscribe to state changes
      this.stateManager.subscribe((state) => {
        if (state.isOpen) {
          this.chat?.show();
          this.button?.hide();
        } else {
          this.chat?.hide();
          this.button?.show();
        }
      });

      this.initialized = true;
    } catch (error) {
      console.error("MeAgent SDK: Initialization failed", error);
      throw error;
    }
  }

  /**
   * Toggle chat open/closed
   */
  private toggleChat(): void {
    this.stateManager.toggleChat();
  }

  /**
   * Send a message
   */
  private async sendMessage(content: string): Promise<void> {
    const state = this.stateManager.getState();

    if (!state.sessionId) {
      console.error("MeAgent SDK: No active session");
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: this.generateId(),
      role: "user",
      content,
      timestamp: Date.now(),
    };
    this.stateManager.addMessage(userMessage);
    this.chat?.addMessage(userMessage);

    // Show loading
    this.stateManager.setLoading(true);
    this.chat?.setLoading(true);
    this.chat?.showLoading();

    let assistantMessage: Message = {
      id: this.generateId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };
    let isFirstChunk = true;
    let detectedOffers: Offer[] = [];
    let detectedBrands: Brand[] = [];
    let detectedCategories: Category[] = [];
    let showWaysToEarnActions = false;
    let hasFinalMessage = false; // Track if we've received a final message

    try {
      await this.apiClient.sendMessage(
        state.sessionId,
        content,
        (chunk: string, rawData?: any) => {
          // Check for function calls and responses
          if (rawData) {
            // Check for query_offers function response
            if (
              rawData.content?.parts?.[0]?.functionResponse?.name ===
              "query_offers"
            ) {
              const matches =
                rawData.content.parts[0].functionResponse.response?.matches ||
                [];
              detectedOffers = this.parseOffers(matches);
            }

            // Check for get_signup_earning_brands function response
            if (
              rawData.content?.parts?.[0]?.functionResponse?.name ===
              "get_signup_earning_brands"
            ) {
              const brands =
                rawData.content.parts[0].functionResponse.response?.brands ||
                [];
              detectedBrands = this.parseBrands(brands);
              console.log(
                "[SDK] Detected signup earning brands:",
                detectedBrands.length
              );
            }

            // Check for get_category_purchase_earning function response
            if (
              rawData.content?.parts?.[0]?.functionResponse?.name ===
              "get_category_purchase_earning"
            ) {
              const categories =
                rawData.content.parts[0].functionResponse.response
                  ?.categories || [];
              detectedCategories = mergeCategoriesWithPresets(categories);
              console.log(
                "[SDK] Detected purchase categories:",
                detectedCategories.length
              );
            }

            // Check for ways_to_earn function call
            if (
              rawData.content?.parts?.[0]?.functionCall?.name === "ways_to_earn"
            ) {
              console.log("[SDK] Detected ways_to_earn function call");
              showWaysToEarnActions = true;
            }
          }

          // Create message container on first data, even if empty text
          if (isFirstChunk) {
            this.chat?.removeLoading();
            assistantMessage.content = chunk || "";
            this.stateManager.addMessage(assistantMessage);
            this.chat?.addMessage(assistantMessage);
            isFirstChunk = false;
          } else if (chunk) {
            // Check if this is a partial/streaming chunk or final complete message
            const isPartial = rawData?.partial === true;

            if (isPartial) {
              // Streaming chunk (delta) - append it for real-time display
              assistantMessage.content += chunk;
              this.stateManager.updateLastMessage(assistantMessage.content);
              this.chat?.updateLastMessage(assistantMessage.content);
            } else if (rawData?.content?.parts?.[0]?.text) {
              // Final complete message
              if (hasFinalMessage) {
                // We already have a final message, so this is additional text
                // after a function call - append it with spacing
                assistantMessage.content += "\n\n" + chunk;
              } else {
                // First final message - replace to ensure accuracy
                assistantMessage.content = chunk;
                hasFinalMessage = true;
              }
              this.stateManager.updateLastMessage(assistantMessage.content);
              this.chat?.updateLastMessage(assistantMessage.content);
            }
          }
        },
        () => {
          // On complete
          this.stateManager.setLoading(false);
          this.chat?.setLoading(false);
          this.chat?.removeLoading();

          // Show offer preview if offers were found
          if (detectedOffers.length > 0) {
            this.chat?.showOfferPreview(detectedOffers);
          }

          // Show brand preview if brands were found
          if (detectedBrands.length > 0) {
            this.chat?.showBrandPreview(detectedBrands);
          }

          // Show category preview if categories were found
          if (detectedCategories.length > 0) {
            this.chat?.showCategoryPreview(detectedCategories);
          }

          // Show ways to earn quick actions if function was called
          if (showWaysToEarnActions) {
            console.log("[SDK] Showing ways to earn actions");
            this.chat?.showWaysToEarnActions();
          }
        },
        (error: Error) => {
          // On error
          console.error("MeAgent SDK: Error sending message", error);
          this.stateManager.setLoading(false);
          this.chat?.setLoading(false);
          this.chat?.removeLoading();

          const errorMessage: Message = {
            id: this.generateId(),
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
            timestamp: Date.now(),
          };
          this.stateManager.addMessage(errorMessage);
          this.chat?.addMessage(errorMessage);
        }
      );
    } catch (error) {
      console.error("MeAgent SDK: Error in sendMessage", error);
      this.stateManager.setLoading(false);
      this.chat?.setLoading(false);
    }
  }

  /**
   * Parse offers from function response
   */
  private parseOffers(matches: any[]): Offer[] {
    return matches.map((match: any[]) => {
      return {
        id: match[0] || "",
        name: match[1] || "Unnamed Offer",
        offerCode: match[2] || "",
        price: match[3] || 0,
        description: match[4] || "",
        discountType: match[6] || "",
        discountPercentage: match[7] || 0,
        brandName: match[12] || "Unknown Brand",
        image: match[13] || undefined,
      };
    });
  }

  /**
   * Parse brands from function response
   */
  private parseBrands(brands: any[]): Brand[] {
    return brands.map((brand: any) => {
      return {
        id: brand.id || "",
        name: brand.name || "Unknown Brand",
        logoUrl: brand.logoUrl || null,
        description: brand.description || null,
        websiteUrl: brand.websiteUrl || null,
        shopifyStoreUrl: brand.shopifyStoreUrl || null,
        network: brand.network || "sepolia",
        categoryId: brand.categoryId || "",
        categoryName: brand.categoryName || "Unknown Category",
        rewardDetails: brand.rewardDetails || {
          earningMethodId: "",
          earningType: "sign_up",
          isActive: true,
          rewardExistingCustomers: false,
          rewardInfo: {
            id: "",
            rewardName: "",
            rewardSymbol: "",
            rewardImage: "",
            rewardValueInDollars: "0",
            rewardOriginalValue: "0",
          },
          rules: [],
        },
      };
    });
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Destroy the SDK
   */
  destroy(): void {
    this.button?.unmount();
    this.chat?.unmount();
    this.initialized = false;
  }
}
