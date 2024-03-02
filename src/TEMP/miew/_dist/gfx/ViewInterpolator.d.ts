export default class ViewInterpolator {
    setup(startView: any, endView: any): void;
    _startTime: any;
    _endTime: any;
    _isPaused: boolean | undefined;
    _srcView: any;
    _dstView: any;
    _isMoving: boolean | undefined;
    isMoving(): boolean | undefined;
    wasStarted(): boolean;
    start(): void;
    getCurrentView(): {
        success: boolean;
        view?: undefined;
    } | {
        success: boolean;
        view: View;
    };
    reset(): void;
    pause(): void;
    resume(): void;
    createView(): View;
}
declare class View {
    position: any;
    scale: number;
    orientation: any;
    set(position: any, scale: any, orientation: any): void;
}
export {};
