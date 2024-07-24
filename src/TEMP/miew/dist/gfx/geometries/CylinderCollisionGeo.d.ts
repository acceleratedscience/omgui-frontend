export default CylinderCollisionGeo;
declare class CylinderCollisionGeo extends ChunkedObjectsGeometry {
    _chunkPos: any;
    _chunkNorms: any;
    _tmpVector: any;
    setItem(itemIdx: any, botPos: any, topPos: any, itemRad: any): void;
}
import ChunkedObjectsGeometry from "./ChunkedObjectsGeometry";
