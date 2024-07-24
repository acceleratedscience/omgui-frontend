export default IsoSurfaceGeometry;
/**
 * This is a base class for isosurface algorithms.
 * @param spheresCount - number of atoms/spheres
 * @param opts - geometry specific options
 * @constructor
 */
declare class IsoSurfaceGeometry {
    constructor(spheresCount: any, opts: any);
    _opts: any;
    zClip: any;
    _posRad: any;
    _colors: any;
    setItem(chunkIdx: any, pos: any, radius: any): void;
    setColor(chunkIdx: any, colorVal: any): void;
    finalize(): void;
    finishUpdate(): void;
    setOpacity(): void;
    raycast(): void;
    getSubset(): never[];
}
