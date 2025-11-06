import { MeAgentSDK } from "./sdk";
import { MeAgentConfig, SupportedNetwork, Environment } from "./types";

/**
 * Global MeAgent namespace
 */
export interface MeAgentGlobal {
  init: (config: MeAgentConfig) => Promise<void>;
  destroy: () => void;
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

// Export for UMD build
const MeAgent: MeAgentGlobal = {
  init,
  destroy,
  Network: SupportedNetwork,
  Environment: Environment,
};

// For UMD build - attach to window
if (typeof window !== "undefined") {
  (window as any).MeAgent = MeAgent;
}

export default MeAgent;
export { MeAgentSDK } from "./sdk";
export { MeAgentConfig, SupportedNetwork, Environment } from "./types";
