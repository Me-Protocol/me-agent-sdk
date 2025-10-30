/**
 * Bottom Sheet Modal Component
 * A modal that slides up from the bottom of the screen
 */
export declare class BottomSheet {
    private container;
    private overlay;
    private sheet;
    private contentElement;
    private isVisible;
    private onCloseCallback?;
    constructor(container: HTMLElement);
    /**
     * Create overlay element
     */
    private createOverlay;
    /**
     * Create sheet element
     */
    private createSheet;
    /**
     * Show the bottom sheet
     */
    show(title: string, content: string, onClose?: () => void): void;
    /**
     * Hide the bottom sheet
     */
    hide(): void;
    /**
     * Get the content element for attaching event listeners
     */
    getContentElement(): HTMLElement;
    /**
     * Check if bottom sheet is visible
     */
    isOpen(): boolean;
    /**
     * Destroy the bottom sheet
     */
    destroy(): void;
}
