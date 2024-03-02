export default TwoColorLinesGeometry;
declare class TwoColorLinesGeometry extends LinesGeometry {
    _collisionGeo: Simple2CCylindersGeometry;
    setItem(itemIdx: any, botPos: any, topPos: any): void;
    raycast(raycaster: any, intersects: any): void;
    getSubset(segmentIndices: any): TwoColorLinesGeometry[];
    _init(segmentsCount: any): void;
    _segCounts: number | undefined;
}
import LinesGeometry from "./LinesGeometry";
import Simple2CCylindersGeometry from "./Simple2CCylindersGeometry";
