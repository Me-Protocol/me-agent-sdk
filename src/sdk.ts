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
import { DevHelper } from "./core/dev-helper";

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
  private devHelper: DevHelper | null = null;
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
      this.apiClient.redemptionAPI,
      {
        apiKey: this.env.MAGIC_PUBLISHABLE_API_KEY,
        chainId: this.env.CHAIN_ID,
        rpcUrl: this.env.RPC_URL,
      },
      this.env.OPEN_REWARD_DIAMOND,
      parseInt(this.env.CHAIN_ID, 10),
      this.env.RPC_URL,
      this.env.RUNTIME_URL,
      this.env.ME_API_KEY,
      this.env.API_V1_URL,
      this.env.GELATO_API_KEY,
      this.config.brandId || ""
    );
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: MeAgentConfig): void {
    if (!config.userId) {
      throw new Error(
        "MeAgent SDK: userId is required. Please provide a userId in the configuration."
      );
    }
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

      // Session will be auto-created on first message
      const sessionId = this.sessionService.getSessionId();

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

      // Set session switch callback
      this.chat.setOnSessionSwitch((newSessionId: string) => {
        this.sessionService.setSessionId(newSessionId);
      });

      // Mount components
      this.button.mount();
      this.chat.mount();

      // Show welcome message
      this.chat.showWelcome();

      // Initialize dev helper if dev mode is enabled
      if (this.config.devMode) {
        this.devHelper = new DevHelper(true, {
          onShowOfferDetail: (offerCode, sessionId) => {
            this.chat?.devShowOfferDetail(offerCode, sessionId);
          },
          onShowBrandList: () => {
            this.chat?.devShowBrandList();
          },
          onShowCategoryGrid: () => {
            this.chat?.devShowCategoryGrid();
          },
        });
      }

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
   * Programmatically open the chat widget
   * @public
   */
  open(): void {
    if (!this.initialized) {
      console.warn("MeAgent SDK: Cannot open chat before initialization");
      return;
    }
    if (!this.isOpen) {
      this.isOpen = true;
      this.chat?.show();
      this.button?.hide();
    }
  }

  /**
   * Programmatically close the chat widget
   * @public
   */
  close(): void {
    if (!this.initialized) {
      console.warn("MeAgent SDK: Cannot close chat before initialization");
      return;
    }
    if (this.isOpen) {
      this.isOpen = false;
      this.chat?.hide();
      this.button?.show();
    }
  }

  /**
   * Programmatically toggle the chat widget
   * @public
   */
  toggle(): void {
    if (!this.initialized) {
      console.warn("MeAgent SDK: Cannot toggle chat before initialization");
      return;
    }
    this.toggleChat();
  }

  /**
   * Update cart items dynamically
   * Call this after adding/removing items from cart to update SDK's cart state
   */
  updateCartItems(cartItems: MeAgentConfig["cartItems"]): void {
    if (!this.initialized) {
      console.warn(
        "MeAgent SDK: Cannot update cart items before initialization"
      );
      return;
    }
    this.config.cartItems = cartItems;
    console.log("MeAgent SDK: Cart items updated", cartItems);
  }

  /**
   * Update liked offers dynamically
   * Call this after liking/unliking offers to update SDK's liked state
   */
  updateLikedOffers(likedOffers: MeAgentConfig["likedOffers"]): void {
    if (!this.initialized) {
      console.warn(
        "MeAgent SDK: Cannot update liked offers before initialization"
      );
      return;
    }
    this.config.likedOffers = likedOffers;
    console.log("MeAgent SDK: Liked offers updated", likedOffers);
  }

  /**
   * Send a message
   */
  private async sendMessage(content: string): Promise<void> {
    // Add user message
    const userMessage = this.sessionService.createMessage("user", content);
    this.sessionService.addMessage(userMessage);
    this.chat?.addMessage(userMessage);

    // Store the first message to use as title if this creates a new session
    const isFirstMessage = !this.sessionService.getSessionId();
    const firstMessageContent = isFirstMessage ? content : null;
    console.log(
      "[SDK] sendMessage - isFirstMessage:",
      isFirstMessage,
      "content:",
      content
    );

    // Show loading
    this.chat?.setLoading(true);
    this.chat?.showLoading();

    let assistantMessage = this.sessionService.createMessage("assistant", "");
    let isFirstChunk = true;
    let parsedData = {
      offers: [] as Offer[],
      brands: [] as Brand[],
      categories: [] as Category[],
      searchCategories: [] as Category[],
      showWaysToEarn: false,
    };
    let hasFinalMessage = false;

    try {
      await this.apiClient.sendMessage(
        this.sessionService.getSessionId(),
        content,
        (chunk: string, rawData?: any) => {
          console.log("[SDK] Chunk handler called:", {
            chunk,
            rawData,
            isFirstChunk,
          });

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
            if (parsed.searchCategories.length > 0) {
              parsedData.searchCategories = parsed.searchCategories;
              console.log(
                "[SDK] Detected search categories:",
                parsed.searchCategories.length
              );
            }
            if (parsed.showWaysToEarn) {
              parsedData.showWaysToEarn = true;
              console.log("[SDK] Detected ways_to_earn function call");
            }
          }

          // Create message container on first data, even if empty text
          if (isFirstChunk) {
            console.log(
              "[SDK] First chunk - creating message with content:",
              chunk
            );
            this.chat?.removeLoading();
            assistantMessage.content = chunk || "";
            this.sessionService.addMessage(assistantMessage);
            this.chat?.addMessage(assistantMessage);
            isFirstChunk = false;
          } else if (chunk !== undefined) {
            // Check if this is a partial/streaming chunk or final complete message
            const isPartial = rawData?.partial === true;

            if (isPartial) {
              // Streaming chunk (delta) - append it for real-time display
              assistantMessage.content += chunk;
              this.sessionService.updateLastMessage(assistantMessage.content);
              this.chat?.updateLastMessage(assistantMessage.content);
            } else if (
              rawData?.response !== undefined ||
              rawData?.content?.parts?.[0]?.text
            ) {
              // Final complete message (new format: rawData.response, old format: rawData.content.parts[0].text)
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
        (returnedSessionId: string) => {
          // On complete - update session ID if this is the first message
          if (returnedSessionId && !this.sessionService.getSessionId()) {
            this.sessionService.setSessionId(returnedSessionId);
            console.log("[SDK] Calling setSessionId with:", {
              returnedSessionId,
              firstMessageContent,
            });
            this.chat?.setSessionId(
              returnedSessionId,
              firstMessageContent || undefined
            );
            console.log("MeAgent SDK: Session created:", returnedSessionId);
          }

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

          // Show search category card list if search categories were found
          if (parsedData.searchCategories.length > 0) {
            this.chat?.showSearchCategoryCardList(parsedData.searchCategories);
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
