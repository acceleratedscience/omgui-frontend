export default CrossGeometry;
declare const CrossGeometry_base: {
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
declare class CrossGeometry extends CrossGeometry_base {
    constructor(chunksCount: any);
    setItem(itemIdx: any, itemPos: any, itemRad: any): void;
}
