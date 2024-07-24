export default VolumeFarPlane;
declare class VolumeFarPlane {
    constructor(volume: any, width: any, height: any);
    _plane: import("./meshes/SimpleMesh").default;
    _initPlaneGeo(width: any, height: any): any;
    getMesh(): import("./meshes/SimpleMesh").default;
}
