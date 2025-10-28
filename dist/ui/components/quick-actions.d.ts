import { QuickAction } from "../../types";
/**
 * Quick Actions Component - Renders a list of actionable items
 */
export declare class QuickActionsComponent {
    /**
     * Get icon for action type
     */
    private static getIconForAction;
    /**
     * Create quick actions list
     */
    static create(actions: QuickAction[], onClick: (action: QuickAction) => void): HTMLDivElement;
    /**
     * Create a message with quick actions
     */
    static createMessageWithActions(content: string, actions: QuickAction[], messageId: string, onActionClick: (action: QuickAction) => void): HTMLDivElement;
}
