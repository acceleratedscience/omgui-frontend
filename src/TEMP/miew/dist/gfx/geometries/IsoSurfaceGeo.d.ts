export default IsoSurfaceGeo;
/**
 * Class for geometry (triangle mesh) representation
 *
 *
 * @param {number} maxNumVertices Maximum possible number of vertices in mesh
 * @param {number} maxNumTriangles Maximum possible number of triangles in mesh
 * @param {boolean} needVertexColors Obvious
 */
declare class IsoSurfaceGeo {
    constructor(maxNumVertices: any, maxNumTriangles: any, needVertexColors: any);
    _maxNumVertices: any;
    _maxNumTriangles: any;
    _vertices: any[];
    _normals: any[];
    _colors: any[] | null;
    _indices: any[];
    _numVertices: number;
    _numTriangles: number;
    destroy(): void;
}
