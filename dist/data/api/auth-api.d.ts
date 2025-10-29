/**
 * Auth API
 * Handles authentication endpoints
 */
import { BaseAPI } from "./base-api";
import { MELoginResponse } from "../../types";
export declare class AuthAPI extends BaseAPI {
    /**
     * Login to ME Protocol (creates account if new user)
     */
    meProtocolLogin(email: string, walletAddress: string): Promise<MELoginResponse>;
}
