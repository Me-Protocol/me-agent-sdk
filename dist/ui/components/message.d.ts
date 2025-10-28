import { Message } from "../../types";
/**
 * Message Component - Renders individual chat messages
 */
export declare class MessageComponent {
    /**
     * Parse markdown-style content and convert to HTML
     */
    private static parseMarkdown;
    /**
     * Get avatar for message role
     */
    private static getAvatar;
    /**
     * Create a message element
     */
    static create(message: Message, onOfferClick?: (offerCode: string) => void): HTMLDivElement;
    /**
     * Create a loading indicator
     */
    static createLoading(): HTMLDivElement;
    /**
     * Update message content (for streaming)
     */
    static updateContent(element: HTMLElement, content: string, onOfferClick?: (offerCode: string) => void): void;
    /**
     * Append a card list or other element to a message's content wrapper
     */
    static appendToMessage(messageElement: HTMLElement, element: HTMLElement): void;
}
