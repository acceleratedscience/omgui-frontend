export default TransformGroup;
declare class TransformGroup {
    static _inverseMatrix: any;
    static _ray: any;
    constructor(geometry: any, geoParams: any, material: any, transforms: any);
    _geometry: any;
    _geoParams: any;
    _material: any;
    _transforms: any;
    raycast(raycaster: any, intersects: any): void;
    getSubset(chunkIndices: any): any[];
    _createMeshes(geometry: any): any[];
}
