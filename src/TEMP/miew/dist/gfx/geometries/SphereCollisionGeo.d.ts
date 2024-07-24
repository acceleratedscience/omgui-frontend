export default SphereCollisionGeo;
declare function SphereCollisionGeo(base: any): {
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
