declare namespace _default {
    export { BackFacePosMaterial };
    export { BackFacePosMaterialFarPlane };
    export { FrontFacePosMaterial };
    export { VolumeMaterial };
}
export default _default;
declare class BackFacePosMaterial {
    constructor(params: any);
}
declare class BackFacePosMaterialFarPlane {
    constructor(params: any);
}
declare class FrontFacePosMaterial {
    constructor(params: any);
}
declare class VolumeMaterial {
    constructor(params: any);
    updateDefines(): void;
    defines: {
        ISO_MODE: any;
        STEPS_COUNT: number;
    } | undefined;
    needsUpdate: boolean | undefined;
}
