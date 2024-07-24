export default Picker;
declare function Picker(gfxObj: any, camera: any, domElement: any): void;
declare class Picker {
    constructor(gfxObj: any, camera: any, domElement: any);
    gfxObj: any;
    camera: any;
    domElement: any;
    screen: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    _lastMousePos: any;
    _mouseTotalDist: number;
    _lastClickBeginTime: number;
    _lastClickPos: any;
    _clickBeginTime: number;
    _clock: Timer;
    _listeners: {
        obj: any;
        type: string;
        handler(e: any): void;
    }[];
    constructor();
    reset(): void;
    picked: {} | undefined;
    handleResize(): void;
    pickObject(screenPos: any): void;
    getMouseInViewport(pageX: any, pageY: any): any;
    mousedown(event: any): void;
    mousemove(event: any): void;
    mouseup(event: any): void;
    touchstart(event: any): void;
    _lastTouchdownPos: any;
    touchend(event: any): void;
    dispose(): void;
}
import Timer from "../Timer";
