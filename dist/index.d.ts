import { MeAgentConfig } from './types';
import { SupportedNetwork, Environment } from './config/env';
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
export { MeAgentConfig } from './types';
export { SupportedNetwork, Environment } from './config/env';
