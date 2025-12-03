/**
 * Environment types
 */
export enum Environment {
  DEV = "dev",
  STAGING = "staging",
  PROD = "prod",
}

/**
 * Supported Networks
 */
export enum SupportedNetwork {
  SEPOLIA = "sepolia",
  HEDERA = "hedera",
  BASE = "base",
  POLYGON = "polygon",
}

/**
 * Network-specific configurations
 */
interface NetworkConfig {
  CHAIN_ID: string;
  RPC_URL: string;
}

/**
 * Network configurations by environment (testnet vs mainnet)
 */
interface NetworkConfigSet {
  testnet: NetworkConfig;
  mainnet: NetworkConfig;
}

/**
 * Environment-specific base configurations
 */
interface EnvironmentConfig {
  API_URL: string;
  AGENT_BASE_URL: string;
  ME_API_KEY: string;
  API_V1_URL: string;
  RUNTIME_URL: string;
  GELATO_API_KEY: string;
  MAGIC_PUBLISHABLE_API_KEY: string;
  OPEN_REWARD_DIAMOND: string;
  useMainnet: boolean; // Determines if mainnet or testnet should be used
}

// Development environment (uses testnets)
const DEV_CONFIG: EnvironmentConfig = {
  API_URL: "https://paas.meappbounty.com/v1/api/",
  AGENT_BASE_URL: "https://agent-adk-api-580283507238.us-central1.run.app",
  ME_API_KEY: "hl3elmtvji75or71j4xy5e",
  API_V1_URL: "https://api.meappbounty.com/",
  MAGIC_PUBLISHABLE_API_KEY: "pk_live_FB79F672A43B8AC2",
  RUNTIME_URL: "https://runtime.meappbounty.com",
  GELATO_API_KEY: "g1UFyiAfIyq_m_M3Cn3LWIO6VQpjVTIbeCV7XLzWGb4_",
  OPEN_REWARD_DIAMOND: "0xacd3379d449ad0042a12f4fa88bc183948f7f472",
  useMainnet: false,
};

// Staging environment (uses testnets)
const STAGING_CONFIG: EnvironmentConfig = {
  API_URL: "https://paas.usemeprotocol.com/v1/api/",
  AGENT_BASE_URL: "https://agent-adk-api-580283507238.us-central1.run.app",
  ME_API_KEY: "hl3elmtvji75or71j4xy5e",
  API_V1_URL: "https://api.usemeprotocol.com/",
  MAGIC_PUBLISHABLE_API_KEY: "pk_live_FB79F672A43B8AC2",
  RUNTIME_URL: "https://runtime.usemeprotocol.com",
  GELATO_API_KEY: "g1UFyiAfIyq_m_M3Cn3LWIO6VQpjVTIbeCV7XLzWGb4_",
  OPEN_REWARD_DIAMOND: "0xacd3379d449ad0042a12f4fa88bc183948f7f472",
  useMainnet: false,
};

// Production environment (uses mainnets)
const PROD_CONFIG: EnvironmentConfig = {
  API_URL: "https://paas.memarketplace.io/v1/api/",
  AGENT_BASE_URL: "https://agent-adk-api-prod-580283507238.us-central1.run.app",
  ME_API_KEY: "prod_key",
  API_V1_URL: "https://api.memarketplace.io/",
  MAGIC_PUBLISHABLE_API_KEY: "pk_live_C375E621E344EE98",
  RUNTIME_URL: "https://runtime.memarketplace.io",
  GELATO_API_KEY: "NJ9Z1bv9FkqrfosPiB_e3pz_q7zh55T1fs3PYDbpEsY_",
  OPEN_REWARD_DIAMOND: "0x65c70b78751e4dbfc5fa3c2ae838faf90bff3355",
  useMainnet: true,
};

const ENV_CONFIGS: Record<Environment, EnvironmentConfig> = {
  [Environment.DEV]: DEV_CONFIG,
  [Environment.STAGING]: STAGING_CONFIG,
  [Environment.PROD]: PROD_CONFIG,
};

/**
 * Network configurations with testnet and mainnet support
 * DEV/STAGING environments use testnet configs
 * PROD environment uses mainnet configs
 */
const NETWORK_CONFIGS: Record<SupportedNetwork, NetworkConfigSet> = {
  [SupportedNetwork.SEPOLIA]: {
    testnet: {
      CHAIN_ID: "11155111", // Sepolia Testnet
      RPC_URL:
        "https://eth-sepolia.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip",
    },
    mainnet: {
      CHAIN_ID: "137", // Polygon Mainnet
      RPC_URL:
        "https://polygon-mainnet.g.alchemy.com/v2/GHkhurMtow255UH_k_Oyd-sFrba-NyLd",
    },
  },
  [SupportedNetwork.HEDERA]: {
    testnet: {
      CHAIN_ID: "296", // Hedera Testnet
      RPC_URL: "https://testnet.hashio.io/api",
    },
    mainnet: {
      CHAIN_ID: "295", // Hedera Mainnet
      RPC_URL: "https://mainnet.hashio.io/api",
    },
  },
  [SupportedNetwork.BASE]: {
    testnet: {
      CHAIN_ID: "84532", // Base Sepolia Testnet
      RPC_URL:
        "https://base-sepolia.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip",
    },
    mainnet: {
      CHAIN_ID: "8453", // Base Mainnet
      RPC_URL:
        "https://base-mainnet.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip",
    },
  },
  [SupportedNetwork.POLYGON]: {
    testnet: {
      CHAIN_ID: "80001", // Polygon Mumbai Testnet
      RPC_URL:
        "https://polygon-mumbai.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip",
    },
    mainnet: {
      CHAIN_ID: "137", // Polygon Mainnet
      RPC_URL:
        "https://polygon-mainnet.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip",
    },
  },
};

/**
 * Complete environment configuration
 */
export interface EnvConfig extends EnvironmentConfig, NetworkConfig {}

/**
 * Get environment configuration based on environment and network
 * Automatically selects testnet or mainnet based on environment
 */
export const getEnv = (
  environment: Environment = Environment.DEV,
  network: SupportedNetwork = SupportedNetwork.SEPOLIA
): EnvConfig => {
  const envConfig = ENV_CONFIGS[environment] || ENV_CONFIGS[Environment.DEV];
  const networkConfigSet =
    NETWORK_CONFIGS[network] || NETWORK_CONFIGS[SupportedNetwork.SEPOLIA];

  // Select testnet or mainnet based on environment
  const networkConfig = envConfig.useMainnet
    ? networkConfigSet.mainnet
    : networkConfigSet.testnet;

  return {
    ...envConfig,
    ...networkConfig,
  };
};

// Default environment (Dev + Sepolia)
export const Env = getEnv(Environment.DEV, SupportedNetwork.SEPOLIA);
