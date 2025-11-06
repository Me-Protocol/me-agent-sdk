/**
 * Base API Client
 * Foundation for all domain-specific API clients
 */

import { MeAgentConfig, EnvConfig } from "../../types";

export class BaseAPI {
  protected config: MeAgentConfig;
  protected env: EnvConfig;
  protected userId: string;

  constructor(config: MeAgentConfig, env: EnvConfig) {
    this.config = config;
    this.env = env;
    this.userId = config.userId;
  }

  /**
   * Get user ID
   */
  getUserId(): string {
    return this.userId;
  }

  /**
   * Get user email from config
   */
  getUserEmail(): string | undefined {
    return this.config.emailAddress;
  }

  /**
   * Make a GET request
   */
  protected async get<T>(
    url: string,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GET ${url} failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Make a POST request
   */
  protected async post<T>(
    url: string,
    body: any,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`POST ${url} failed: ${response.statusText}`);
    }

    return await response.json();
  }
}
