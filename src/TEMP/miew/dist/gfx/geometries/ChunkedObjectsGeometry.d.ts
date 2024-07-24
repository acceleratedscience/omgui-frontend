export default ChunkedObjectsGeometry;
/**
 * This class represents geometry which consists of separate chunks.
 * Each chunk has same index and similar geometry with equal points and faces count.
 * Each chunk has by default only one color.
 * @constructor
 */
declare class ChunkedObjectsGeometry {
    constructor(chunkGeo: any, chunksCount: any);
    _chunkGeo: any;
    startUpdate(): boolean;
    finishUpdate(): void;
    setColor(chunkIdx: any, colorVal: any): void;
    finalize(): void;
    setOpacity(chunkIndices: any, value: any): void;
    raycast(raycaster: any, intersects: any): void;
    getSubset(chunkIndices: any): any[];
    _init(chunkGeo: any, chunksCount: any): void;
    _chunkSize: any;
    _index: any;
    _positions: any;
    _normals: any;
    _colors: any;
    _alpha: any;
}
