export default Simple2CCylindersGeometry;
declare class Simple2CCylindersGeometry extends ChunkedObjectsGeometry {
    _chunkPos: any;
    _chunkNorms: any;
    _tmpVector: any;
    setItem(itemIdx: any, botPos: any, topPos: any, itemRad: any): void;
}
import ChunkedObjectsGeometry from "./ChunkedObjectsGeometry";
