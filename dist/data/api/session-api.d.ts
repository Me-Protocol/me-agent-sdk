/**
 * Session API
 * Handles session creation and management
 */
import { BaseAPI } from "./base-api";
export declare class SessionAPI extends BaseAPI {
    /**
     * Create a new chat session
     */
    createSession(): Promise<string>;
}
