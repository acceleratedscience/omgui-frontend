export default SimpleSpheresGeometry;
declare const SimpleSpheresGeometry_base: {
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
declare class SimpleSpheresGeometry extends SimpleSpheresGeometry_base {
    constructor(spheresCount: any, sphereComplexity: any);
    _chunkPos: any;
    _tmpPositions: any;
    setItem(itemIdx: any, itemPos: any, itemRad: any): void;
}
