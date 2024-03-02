export default LinesGeometry;
/**
 * This class represents geometry which consists lines. This can build bounding volumes
 * @constructor
 *
 * @param {number}  segmentsCount   Number of segments per chunk.
 */
declare class LinesGeometry extends BaseLinesGeometry {
    computeBoundingSphere(): void;
    boundingSphere: any;
    computeBoundingBox(): void;
    boundingBox: any;
    finalize(): void;
}
import BaseLinesGeometry from "./ThickLinesGeometry";
