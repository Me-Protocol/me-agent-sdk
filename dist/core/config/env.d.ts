/**
 * Environment types
 */
export declare enum Environment {
    DEV = "dev",
    STAGING = "staging",
    PROD = "prod"
}
/**
 * Supported Networks
 */
export declare enum SupportedNetwork {
    SEPOLIA = "sepolia",
    HEDERA = "hedera",
    BASE = "base",
    POLYGON = "polygon"
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
/**
 * Complete environment configuration
 */
export interface EnvConfig extends EnvironmentConfig, NetworkConfig {
}
/**
 * Get environment configuration based on environment and network
 */
export declare const getEnv: (environment?: Environment, network?: SupportedNetwork) => EnvConfig;
export declare const Env: EnvConfig;
export {};
