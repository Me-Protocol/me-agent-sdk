/**
 * Message Types
 * All types related to chat messages and sessions
 */

/**
 * Message roles
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * Message structure
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

/**
 * Chat state
 */
export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
}

/**
 * Session response from API
 */
export interface SessionResponse {
  id: string;
  appName: string;
  userId: string;
  state: Record<string, any>;
  events: any[];
  lastUpdateTime: number;
}

/**
 * API message payload (new format)
 */
export interface SendMessagePayload {
  query: string;
  session_id?: string;
  user_id: string;
}

/**
 * API response from query endpoint
 */
export interface QueryResponse {
  response: string;
  session_id: string;
  function_response?: {
    id: string;
    name: string;
    response: {
      count?: number;
      message?: string;
      status: string;
      [key: string]: any;
    };
  };
}

/**
 * Quick action button configuration
 */
export interface QuickAction {
  id: string;
  label: string;
  value: string;
  icon?: string;
}
