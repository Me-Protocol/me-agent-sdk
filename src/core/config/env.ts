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
  OPEN_REWARD_DIAMOND: string;
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
}

// Development environment
const DEV_CONFIG: EnvironmentConfig = {
  API_URL: "https://paas.meappbounty.com/v1/api/",
  AGENT_BASE_URL: "https://fastapi-proxy-580283507238.us-central1.run.app",
  ME_API_KEY: "hl3elmtvji75or71j4xy5e",
  API_V1_URL: "https://api.meappbounty.com/",
  MAGIC_PUBLISHABLE_API_KEY: "pk_live_FB79F672A43B8AC2",
  RUNTIME_URL: "https://runtime.meappbounty.com",
  GELATO_API_KEY: "MJYP1xZCxyhLQVdqj9_i0YoNybdToa5T7c_X40a1hto_",
};

// Staging environment
const STAGING_CONFIG: EnvironmentConfig = {
  API_URL: "https://paas-staging.meappbounty.com/v1/api/",
  AGENT_BASE_URL:
    "https://fastapi-proxy-staging-580283507238.us-central1.run.app",
  ME_API_KEY: "staging_key",
  API_V1_URL: "https://api-staging.meappbounty.com/",
  MAGIC_PUBLISHABLE_API_KEY: "pk_live_STAGING_KEY",
  RUNTIME_URL: "https://runtime-staging.meappbounty.com",
  GELATO_API_KEY: "staging_gelato_key",
};

// Production environment
const PROD_CONFIG: EnvironmentConfig = {
  API_URL: "https://paas.meappbounty.com/v1/api/",
  AGENT_BASE_URL: "https://fastapi-proxy.meappbounty.com",
  ME_API_KEY: "prod_key",
  API_V1_URL: "https://api.meappbounty.com/",
  MAGIC_PUBLISHABLE_API_KEY: "pk_live_PROD_KEY",
  RUNTIME_URL: "https://runtime.meappbounty.com",
  GELATO_API_KEY: "prod_gelato_key",
};

const ENV_CONFIGS: Record<Environment, EnvironmentConfig> = {
  [Environment.DEV]: DEV_CONFIG,
  [Environment.STAGING]: STAGING_CONFIG,
  [Environment.PROD]: PROD_CONFIG,
};

const NETWORK_CONFIGS: Record<SupportedNetwork, NetworkConfig> = {
  [SupportedNetwork.SEPOLIA]: {
    CHAIN_ID: "11155111",
    RPC_URL:
      "https://eth-sepolia.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip",
    OPEN_REWARD_DIAMOND: "0x2C123047B23809DbCCDA2d34bB5158D2563221E3",
  },
  [SupportedNetwork.HEDERA]: {
    CHAIN_ID: "296",
    RPC_URL: "https://testnet.hashio.io/api",
    OPEN_REWARD_DIAMOND: "0x3b03a7980bfe38c9daa4c346ccf495eb24e16782",
  },
  [SupportedNetwork.BASE]: {
    CHAIN_ID: "11155111", // Using Sepolia for now
    RPC_URL:
      "https://eth-sepolia.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip",
    OPEN_REWARD_DIAMOND: "0xacd3379d449ad0042a12f4fa88bc183948f7f472",
  },
  [SupportedNetwork.POLYGON]: {
    CHAIN_ID: "11155111", // Using Sepolia for now
    RPC_URL:
      "https://eth-sepolia.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip",
    OPEN_REWARD_DIAMOND: "0xacd3379d449ad0042a12f4fa88bc183948f7f472",
  },
};

/**
 * Complete environment configuration
 */
export interface EnvConfig extends EnvironmentConfig, NetworkConfig {}

/**
 * Get environment configuration based on environment and network
 */
export const getEnv = (
  environment: Environment = Environment.DEV,
  network: SupportedNetwork = SupportedNetwork.SEPOLIA
): EnvConfig => {
  const envConfig = ENV_CONFIGS[environment] || ENV_CONFIGS[Environment.DEV];
  const networkConfig =
    NETWORK_CONFIGS[network] || NETWORK_CONFIGS[SupportedNetwork.SEPOLIA];

  return {
    ...envConfig,
    ...networkConfig,
  };
};

// Default environment (Dev + Sepolia)
export const Env = getEnv(Environment.DEV, SupportedNetwork.SEPOLIA);
