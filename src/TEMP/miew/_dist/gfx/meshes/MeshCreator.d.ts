export default MeshCreator;
declare class MeshCreator {
    static createSpheres(caps: any, settings: any): {
        Geometry(a: any, b: any): import("../geometries/InstancedSpheresGeometry").default;
        Object: typeof import("./ZSpriteMesh").default;
        initMaterial: (material: any) => void;
    };
    static create2CClosedCylinders(_caps: any, _settings: any): {
        Geometry(a: any, b: any): import("../geometries/Instanced2CCylindersGeometry").default;
        Object: typeof import("./ZSpriteMesh").default;
        initMaterial: (material: any) => void;
    };
    static create2CCylinders(caps: any, settings: any): {
        Geometry(a: any, b: any): import("../geometries/Instanced2CCylindersGeometry").default;
        Object: typeof import("./ZSpriteMesh").default;
        initMaterial: (material: any) => void;
    };
    static create2CLines(_caps: any, _settings: any, renderParams: any): {
        Geometry: any;
        Object: typeof import("./ThickLineMesh").default;
        initMaterial: (material: any) => void;
    };
    static createCrosses(_caps: any, _settings: any, renderParams: any): {
        Geometry: any;
        Object: typeof import("./ThickLineMesh").default;
        initMaterial: (material: any) => void;
    };
    static createExtrudedChains(_caps: any, _settings: any): {
        Geometry: any;
        Object: typeof import("./SimpleMesh").default;
        initMaterial: (material: any) => void;
    };
    static createChunkedLines(_caps: any, _settings: any, renderParams: any): {
        Geometry: any;
        Object: typeof import("./ThickLineMesh").default;
        initMaterial: (material: any) => void;
    };
    static createQuickSurface(caps: any, settings: any, renderParams: any): {
        Geometry: any;
        Object: typeof import("./ZClippedMesh").default;
        initMaterial: (material: any) => void;
    };
    static createContactSurface(caps: any, settings: any, renderParams: any): {
        Geometry: any;
        Object: typeof import("./ZClippedMesh").default;
        initMaterial: (material: any) => void;
    };
    static createSASSES(caps: any, settings: any, renderParams: any): {
        Geometry: any;
        Object: typeof import("./ZClippedMesh").default;
        initMaterial: (material: any) => void;
    };
    static createLabels(_caps: any, _settings: any): {
        Geometry: typeof import("../geometries/LabelsGeometry").default;
        Object: typeof import("./TextMesh").default;
        initMaterial(): void;
    };
}
