export default SSIsosurfaceGeometry;
/**
 * This class implements 'quick' isosurface geometry generation algorithm.
 * @param spheresCount - number of atoms/spheres
 * @param opts - geometry specific options
 * @constructor
 */
declare class SSIsosurfaceGeometry extends IsoSurfaceGeometry {
    _build(): void;
    _fromGeo(geoOut: any): void;
    convertToAtomsColored(packedArrays: any, atomsColored: any): void;
    getGeo(): IsoSurfaceGeo | null | undefined;
    destroy(): void;
    atoms: any;
    hashLines: any;
    hashEntries: any;
    /**
     * Calculates bounding box for array with spheres (atoms)
     *
     * @param {Object}  atoms      Atoms array
     * @param {Vector3} vBoxMin    Bounding box min point
     * @param {Vector3} vBoxMax    Bounding box max point
     */
    getBoundingBox(atoms: any, vBoxMin: Vector3, vBoxMax: Vector3): void;
    /**
     * Calculate (x,y,z) cordinate of the cell corner point
     *
     * @param {Vector3} vBoxMin Bounding box min point
     * @param {Vector3} vBoxMax Bounding box max point
     * @param {number} x Cell integer x coordinate
     * @param {number} y Cell integer y coordinate
     * @param {number} z Cell integer z coordinate
     * @param {number} numPoints NUm points in cell on side
     * @param {Vector3} vOut Output vector
     */
    getCornerCoord(vBoxMin: Vector3, vBoxMax: Vector3, x: number, y: number, z: number, numPoints: number, vOut: Vector3): void;
    /**
     * Calculate point of intersection of sphere surface
     * and cell edge, given by [indexA, indexB] line
     *
     * @param {number} indexA Cell vertex index in [0..11]
     * @param {number} indexB Cell vertex index in [0..11]
     * @param {array}  sign   Sign array for all 8 vertices
     * @param {object} cube   Cube
     * @param {number} indexPointValue for value placement
     * @param {Vector3} vOut  Point of intersection
     */
    buildEdgePoint(indexA: number, indexB: number, sign: any[], cube: object, indexPointValue: number, vOut: Vector3): void;
    /**
     * Check if triangle is visible (vertices are close to atoms included in visibility set)
     *
     * @param {Vector3} v0 Vertex #0
     * @param {Vector3} v1 Vertex #1
     * @param {Vector3} v2 Vertex #2
     * @returns {boolean} true if triangle is visible
     */
    isTriangleVisible(v0: Vector3, v1: Vector3, v2: Vector3): boolean;
    /**
     * Add triangle to result geometry
     *
     * @param {Vector3} v0 Vertex #0
     * @param {Vector3} v1 Vertex #1
     * @param {Vector3} v2 Vertex #2
     * @returns {boolean} false if no more triangles can be added
     */
    addTriangle(v0: Vector3, v1: Vector3, v2: Vector3): boolean;
    /**
     * Build result geometry (triangle mesh) from marching cube cells
     *
     * @param {number} meshRes Marchnig cube vertex count on each side
     * @param {Vector3} vBoxMin Bounding box point min
     * @param {Vector3} vBoxMax Bounding box point max
     * @param {number} corners float values array for each cube point
     * @param {Vector3} vCellStep vector to next cube cell diagonal point
     * @param {object} cube IsoSurfaceMarchCube object
     * @returns {number} 0, if success (<0) is error
     */
    buildGeoFromCorners(meshRes: number, vBoxMin: Vector3, vBoxMax: Vector3, corners: number, vCellStep: Vector3, cube: object): number;
    /**
     * Returns number of cell with intersection with at least one sphere.
     * Using this number, we can estimate required number of vertices
     * and triangles to build result mesh.
     *
     * @param {number} side Number of points in cube voxels
     * @param {number} numCells Number of cells in cube voxels (per direction)
     * @param {array} corners Array of float values for cube corner points
     * @param {object} cube IsoSurfaceMarchCube object
     * @returns {number} numIntersectedCells
     */
    getNumIntersectedCells(side: number, numCells: number, corners: any[], cube: object): number;
    getType(letter: any): number;
    /**
     * Calculate values for marching cube grid points
     * positive values are outside sphere, negative - is inside
     *
     * @param {array} corners array of float values
     * @param {number} side Number of point in cube in 1 dimennsion
     * @param {Vector3} vBoxMin Bounding box min point
     * @param {Vector3} vBoxMax Bounding box max point
     * @param {array} atoms Array of input atoms
     * @param {number} probeRad radius for atom probing
     */
    calculateGridCorners(corners: any[], side: number, vBoxMin: Vector3, vBoxMax: Vector3, atoms: any[], probeRad: number): void;
    /**
     * Create memory pool for vertex hash management
     *
     * @param {number} maxNumVertices Maximum possible number of vertices (that will be build)
     * @param {number} maxNumTriangles Maximum possible number of triangles (that will be build)
     * @returns {number} 0, if success. (<0) is non memory
     */
    createVertexHash(maxNumVertices: number, maxNumTriangles: number): number;
    maxNumVertices: number | undefined;
    maxNumTriangles: number | undefined;
    numHashEtriesAllocated: number | undefined;
    numHashEntryIndex: number | undefined;
    /**
     * Allocate and return new hash entry. Just check possible amount.
     *
     * @returns {number} index of hash entry, that can be used for geometry add vertex functionality
     */
    getNewHashEntry(): number;
    /**
     * Add vertex to geometry structure
     * using vertex hash table to quickly check, is this vertex already exist in geometry
     *
     * @param {object} geoOut Geometry to build
     * @param {Vector3} vAdd Vertex to add
     * @returns {number} index of added (or existing) vertex in geometry.
     */
    addVertexToGeo(geoOut: object, vAdd: Vector3): number;
    /**
     *
     * @param {number} side some placeholder description
     * @param {number} probeSphereRadius some placeholder description
     * @param {object} vBoxMin some placeholder description
     * @param {object} vBoxMax some placeholder description
     * @param {object} geoOut some placeholder description
     * @param {object} corners some placeholder description
     * @returns {number} always 0
     */
    modifyExcludedFromGeo(side: number, probeSphereRadius: number, vBoxMin: object, vBoxMax: object, geoOut: object, corners: object): number;
    _innerBuild(): number;
    complex: any;
    meshResolution: any;
    atomRadiusScale: any;
    colorMode: any;
    probeRadius: any;
    useVertexColors: boolean | undefined;
    excludeProbe: any;
    visibilitySelector: any;
    geoOut: IsoSurfaceGeo | null | undefined;
    vBoxMin: any;
    vBoxMax: any;
    marCubeResoultion: number | undefined;
    voxelWorld: IsosurfaceBuildNormals | null | undefined;
}
import IsoSurfaceGeometry from "./IsoSurfaceGeometry";
import IsoSurfaceGeo from "./IsoSurfaceGeo";
import IsosurfaceBuildNormals from "./IsosurfaceBuildNormals";
