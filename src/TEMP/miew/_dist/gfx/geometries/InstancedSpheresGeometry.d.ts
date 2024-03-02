export default InstancedSpheresGeometry;
declare const InstancedSpheresGeometry_base: {
    new (count: any, ...args: any[]): {
        [x: string]: any;
        _objects: any[];
        boundingSphere: any;
        boundingBox: any;
        setSphere(idx: any, position: any, radius: any): void;
        raycast(raycaster: any, intersects: any): void;
        computeBoundingBox(): void;
        computeBoundingSphere(): void;
    };
    [x: string]: any;
};
declare class InstancedSpheresGeometry extends InstancedSpheresGeometry_base {
    constructor(spheresCount: any, sphereComplexity: any, useZSprites: any);
    _sphGeometry: any;
    setItem(itemIdx: any, itemPos: any, itemRad: any): void;
    setColor(itemIdx: any, colorVal: any): void;
    startUpdate(): boolean;
    finishUpdate(): void;
    finalize(): void;
    setOpacity(chunkIndices: any, value: any): void;
    getSubset(chunkIndices: any): any[];
    _init(spheresCount: any, sphereGeo: any): void;
    _offsets: any;
    _colors: any;
    _alpha: any;
}
