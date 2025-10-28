/**
 * Card List Component - Reusable component for displaying lists in chat
 * Can be used for offers, earnings, recommendations, etc.
 */
export interface CardListItem {
    id: string;
    image?: string;
    title: string;
    subtitle?: string;
    icon?: string;
}
export interface CardListConfig {
    items: CardListItem[];
    title?: string;
    actionLabel?: string;
    onAction?: () => void;
    onItemClick?: (item: CardListItem) => void;
}
export declare class CardList {
    /**
     * Create a card list element
     */
    static create(config: CardListConfig): HTMLDivElement;
}
