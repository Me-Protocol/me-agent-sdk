/**
 * Base API Client
 * Foundation for all domain-specific API clients
 */
import { MeAgentConfig, EnvConfig } from "../../types";
export declare class BaseAPI {
    protected config: MeAgentConfig;
    protected env: EnvConfig;
    protected userId: string;
    constructor(config: MeAgentConfig, env: EnvConfig);
    /**
     * Get user ID
     */
    getUserId(): string;
    /**
     * Get user email from config
     */
    getUserEmail(): string | undefined;
    /**
     * Make a GET request
     */
    protected get<T>(url: string, headers?: Record<string, string>): Promise<T>;
    /**
     * Make a POST request
     */
    protected post<T>(url: string, body: any, headers?: Record<string, string>): Promise<T>;
}
