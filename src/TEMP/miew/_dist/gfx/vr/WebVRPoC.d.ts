export default class WebVRPoC {
    constructor(onToggle: any);
    _mainCamera: any;
    _button: HTMLAnchorElement | HTMLButtonElement | null;
    _onToggle: any;
    _molContainer: import("../RCGroup").default;
    _user: import("../RCGroup").default;
    _scalingPivot: any;
    _controller1: any;
    _controller2: any;
    _pressedGripsCounter: number;
    _distance: number;
    _gfx: any;
    startScalingByControllers(): void;
    stopScalingByControllers(): void;
    handleGripsDown(event: any): void;
    handleGripsUp(event: any): void;
    enable(gfx: any): void;
    _mainFog: any;
    _plugVRNodesIntoScene(gfx: any, renderer: any): void;
    _setControllersListeners(): void;
    disable(): void;
    _unplugVRNodesFromScene(camera: any): void;
    _createControllerMesh(): any;
    updateMoleculeScale(): void;
    /**
     * Reposition molecule right before the camera.
     * @note The proper way is to initiate headset in the place of common Miew's camera.
     * But threejs limitations on setting new XRReferenceSpace enforce the molecule repositioning
     * Hope, something will change.
     */
    moveSceneBehindHeadset(): void;
    getCanvas(): any;
}
