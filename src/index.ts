import { MeAgentSDK } from "./sdk";
import { MeAgentConfig, SupportedNetwork, Environment } from "./types";

/**
 * Global MeAgent namespace
 */
export interface MeAgentGlobal {
  init: (config: MeAgentConfig) => Promise<void>;
  destroy: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  updateCartItems: (cartItems: MeAgentConfig["cartItems"]) => void;
  updateLikedOffers: (likedOffers: MeAgentConfig["likedOffers"]) => void;
  Network: typeof SupportedNetwork;
  Environment: typeof Environment;
}

let sdkInstance: MeAgentSDK | null = null;

/**
 * Initialize the MeAgent SDK
 */
async function init(config: MeAgentConfig): Promise<void> {
  if (sdkInstance) {
    console.warn(
      "MeAgent: Instance already exists. Destroying previous instance."
    );
    destroy();
  }

  sdkInstance = new MeAgentSDK(config);
  await sdkInstance.init();
}

/**
 * Destroy the SDK instance
 */
function destroy(): void {
  if (sdkInstance) {
    sdkInstance.destroy();
    sdkInstance = null;
  }
}

/**
 * Open the chat widget programmatically
 */
function open(): void {
  if (sdkInstance) {
    sdkInstance.open();
  } else {
    console.warn("MeAgent: SDK not initialized. Call MeAgent.init() first.");
  }
}

/**
 * Close the chat widget programmatically
 */
function close(): void {
  if (sdkInstance) {
    sdkInstance.close();
  } else {
    console.warn("MeAgent: SDK not initialized. Call MeAgent.init() first.");
  }
}

/**
 * Toggle the chat widget programmatically
 */
function toggle(): void {
  if (sdkInstance) {
    sdkInstance.toggle();
  } else {
    console.warn("MeAgent: SDK not initialized. Call MeAgent.init() first.");
  }
}

/**
 * Update cart items dynamically
 */
function updateCartItems(cartItems: MeAgentConfig["cartItems"]): void {
  if (sdkInstance) {
    sdkInstance.updateCartItems(cartItems);
  } else {
    console.warn("MeAgent: SDK not initialized. Call MeAgent.init() first.");
  }
}

/**
 * Update liked offers dynamically
 */
function updateLikedOffers(likedOffers: MeAgentConfig["likedOffers"]): void {
  if (sdkInstance) {
    sdkInstance.updateLikedOffers(likedOffers);
  } else {
    console.warn("MeAgent: SDK not initialized. Call MeAgent.init() first.");
  }
}

// Export for UMD build
const MeAgent: MeAgentGlobal = {
  init,
  destroy,
  open,
  close,
  toggle,
  updateCartItems,
  updateLikedOffers,
  Network: SupportedNetwork,
  Environment: Environment,
};

// For UMD build - attach to window
if (typeof window !== "undefined") {
  (window as any).MeAgent = MeAgent;
}

export default MeAgent;
export { MeAgentSDK } from "./sdk";
export {
  MeAgentConfig,
  CartItem,
  SupportedNetwork,
  Environment,
} from "./types";
