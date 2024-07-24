export default ExtrudedObjectsGeometry;
declare class ExtrudedObjectsGeometry extends ChunkedObjectsGeometry {
    constructor(shape: any, ringsCount: any, chunksCount: any);
    _ringsCount: any;
    _tmpShape: any[];
    setItem(itemIdx: any, matrices: any, hasSlope?: boolean, hasCut?: boolean): void;
    _setPoints(matrices: any, ptsCount: any, ringsCount: any, chunkStartIdx: any): void;
    _setBaseNormals(ptsCount: any, ringsCount: any, chunkStartIdx: any): void;
    _setSlopeNormals(ptsCount: any, ringsCount: any, chunkStartIdx: any): void;
    _countNormalsInRing(ptsCount: any, vtxIdx: any, isSlope: any, shiftToExtraPt: any): void;
    _addCut(ptsCount: any, ringsCount: any, chunkStartIdx: any): void;
}
import ChunkedObjectsGeometry from "./ChunkedObjectsGeometry";
