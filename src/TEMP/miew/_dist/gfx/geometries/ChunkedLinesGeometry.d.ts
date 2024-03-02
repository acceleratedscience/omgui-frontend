export default ChunkedLinesGeometry;
/**
 * This class represents geometry which consists of separate chunks.
 * Each chunk has same index and similar geometry with equal points and faces count.
 * Each chunk has by default only one color.
 * @constructor
 *
 * @param {number}  chunksCount     Total chunks count.
 * @param {number}  segmentsCount   Number of segments per chunk.
 * @param {boolean} enableCollision Enable or disable collision where each segment is
 *                                  a collidable cylinder.
 * collision geometry.
 */
declare class ChunkedLinesGeometry extends LinesGeometry {
    constructor(chunksCount: any, segmentsCount: any, enableCollision: any);
    _collisionGeo: CylinderCollisionGeo | null;
    raycast(raycaster: any, intersects: any): void;
    getSubset(chunkIndices: any): ChunkedLinesGeometry[];
    _init(chunkSize: any): void;
    _chunkSize: any;
}
import LinesGeometry from "./LinesGeometry";
import CylinderCollisionGeo from "./CylinderCollisionGeo";
