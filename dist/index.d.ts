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
declare const MeAgent: MeAgentGlobal;
export default MeAgent;
export { MeAgentConfig, SupportedNetwork, Environment } from "./types";
