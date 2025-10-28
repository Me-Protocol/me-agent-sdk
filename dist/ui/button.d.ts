/**
 * Floating Button Component
 */
export declare class FloatingButton {
    private element;
    private position;
    private onClick;
    constructor(position: "bottom-right" | "bottom-left", onClick: () => void);
    /**
     * Create the button element
     */
    private create;
    /**
     * Mount the button to the DOM
     */
    mount(): void;
    /**
     * Remove the button from the DOM
     */
    unmount(): void;
    /**
     * Get the button element
     */
    getElement(): HTMLButtonElement;
    /**
     * Hide the button
     */
    hide(): void;
    /**
     * Show the button
     */
    show(): void;
}
