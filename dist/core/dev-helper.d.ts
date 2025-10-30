/**
 * Development Helper
 * Provides keyboard shortcuts for testing SDK features in dev mode
 */
export interface DevHelperCallbacks {
    onShowOfferDetail?: (offerCode: string, sessionId: string) => void;
    onShowBrandList?: () => void;
    onShowCategoryGrid?: () => void;
}
export declare class DevHelper {
    private enabled;
    private callbacks;
    private helpVisible;
    private helpOverlay;
    constructor(enabled: boolean, callbacks: DevHelperCallbacks);
    private initialize;
    private handleKeyPress;
    private showTestOfferDetail;
    private showTestBrandList;
    private showTestCategoryGrid;
    private toggleHelp;
    private showHelp;
    private hideHelp;
    /**
     * Clean up and remove event listeners
     */
    destroy(): void;
}
