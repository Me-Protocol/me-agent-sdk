import {
  MeAgentConfig,
  Message,
  Offer,
  Brand,
  Category,
  EnvConfig,
} from "./types";
import { mergeCategoriesWithPresets } from "./core/constants/categories";
import { SessionService } from "./services/session-service";
import { MessageParser } from "./services/message-parser";
import { RedemptionService } from "./services/redemption-service";
import { APIClient } from "./data/api/api-client";
import { SessionAPI } from "./data/api/session-api";
import { ChatAPI } from "./data/api/chat-api";
import { AuthAPI } from "./data/api/auth-api";
import { RewardAPI } from "./data/api/reward-api";
import { FloatingButton } from "./views/components/button";
import { ChatPopup } from "./views/components/chat";
import { injectStyles } from "./views/shared/styles";
import { getEnv, SupportedNetwork, Environment } from "./core/config/env";

/**
 * Main SDK Class
 */
export class MeAgentSDK {
  private config: MeAgentConfig;
  private env: EnvConfig;
  private sessionService: SessionService;
  private messageParser: MessageParser;
  private redemptionService: RedemptionService | null = null;
  private apiClient: APIClient;
  private button: FloatingButton | null = null;
  private chat: ChatPopup | null = null;
  private initialized = false;
  private isOpen: boolean = false;

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

    // Initialize API client
    this.apiClient = new APIClient(this.config, this.env);

    // Initialize services
    const sessionAPI = new SessionAPI(this.config, this.env);
    const chatAPI = new ChatAPI(this.config, this.env);
    const authAPI = new AuthAPI(this.config, this.env);
    const rewardAPI = new RewardAPI(this.config, this.env);

    this.sessionService = new SessionService(sessionAPI, chatAPI);
    this.messageParser = new MessageParser();

    // Initialize RedemptionService with network-specific configuration
    this.redemptionService = new RedemptionService(
      authAPI,
      rewardAPI,
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
      const sessionId = await this.sessionService.getOrCreateSession();

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
        this.redemptionService || undefined
      );

      // Mount components
      this.button.mount();
      this.chat.mount();

      // Show welcome message
      this.chat.showWelcome();

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
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.chat?.show();
      this.button?.hide();
    } else {
      this.chat?.hide();
      this.button?.show();
    }
  }

  /**
   * Send a message
   */
  private async sendMessage(content: string): Promise<void> {
    const sessionId = this.sessionService.getSessionId();

    if (!sessionId) {
      console.error("MeAgent SDK: No active session");
      return;
    }

    // Add user message
    const userMessage = this.sessionService.createMessage("user", content);
    this.sessionService.addMessage(userMessage);
    this.chat?.addMessage(userMessage);

    // Show loading
    this.chat?.setLoading(true);
    this.chat?.showLoading();

    let assistantMessage = this.sessionService.createMessage("assistant", "");
    let isFirstChunk = true;
    let parsedData = {
      offers: [] as Offer[],
      brands: [] as Brand[],
      categories: [] as Category[],
      showWaysToEarn: false,
    };
    let hasFinalMessage = false;

    try {
      await this.apiClient.sendMessage(
        sessionId,
        content,
        (chunk: string, rawData?: any) => {
          // Parse function calls and responses using MessageParser
          if (rawData) {
            const parsed = this.messageParser.parseMessageData(rawData);
            if (parsed.offers.length > 0) {
              parsedData.offers = parsed.offers;
            }
            if (parsed.brands.length > 0) {
              parsedData.brands = parsed.brands;
              console.log(
                "[SDK] Detected signup earning brands:",
                parsed.brands.length
              );
            }
            if (parsed.categories.length > 0) {
              parsedData.categories = parsed.categories;
              console.log(
                "[SDK] Detected purchase categories:",
                parsed.categories.length
              );
            }
            if (parsed.showWaysToEarn) {
              parsedData.showWaysToEarn = true;
              console.log("[SDK] Detected ways_to_earn function call");
            }
          }

          // Create message container on first data, even if empty text
          if (isFirstChunk) {
            this.chat?.removeLoading();
            assistantMessage.content = chunk || "";
            this.sessionService.addMessage(assistantMessage);
            this.chat?.addMessage(assistantMessage);
            isFirstChunk = false;
          } else if (chunk) {
            // Check if this is a partial/streaming chunk or final complete message
            const isPartial = rawData?.partial === true;

            if (isPartial) {
              // Streaming chunk (delta) - append it for real-time display
              assistantMessage.content += chunk;
              this.sessionService.updateLastMessage(assistantMessage.content);
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
              this.sessionService.updateLastMessage(assistantMessage.content);
              this.chat?.updateLastMessage(assistantMessage.content);
            }
          }
        },
        () => {
          // On complete
          this.chat?.setLoading(false);
          this.chat?.removeLoading();

          // Show offer preview if offers were found
          if (parsedData.offers.length > 0) {
            this.chat?.showOfferPreview(parsedData.offers);
          }

          // Show brand preview if brands were found
          if (parsedData.brands.length > 0) {
            this.chat?.showBrandPreview(parsedData.brands);
          }

          // Show category preview if categories were found
          if (parsedData.categories.length > 0) {
            this.chat?.showCategoryPreview(parsedData.categories);
          }

          // Show ways to earn quick actions if function was called
          if (parsedData.showWaysToEarn) {
            console.log("[SDK] Showing ways to earn actions");
            this.chat?.showWaysToEarnActions();
          }
        },
        (error: Error) => {
          // On error
          console.error("MeAgent SDK: Error sending message", error);
          this.chat?.setLoading(false);
          this.chat?.removeLoading();

          const errorMessage = this.sessionService.createMessage(
            "assistant",
            "Sorry, something went wrong. Please try again."
          );
          this.sessionService.addMessage(errorMessage);
          this.chat?.addMessage(errorMessage);
        }
      );
    } catch (error) {
      console.error("MeAgent SDK: Error in sendMessage", error);
      this.chat?.setLoading(false);
    }
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
