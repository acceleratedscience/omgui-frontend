export default IsosurfaceBuildNormals;
/**
 * Build normals for isosurface, using atoms information
 *
 * @param {number} numAtoms     - Number of atoms in molecule
 * @param {Element} atoms      - Array of atoms
 * @param {Vector3} vBoxMin     - Bounding box min
 * @param {Vector3} vBoxMax     - Bounding box max
 * @param {number} probeRadius     - Normals for output
 *
 */
declare class IsosurfaceBuildNormals {
    constructor(numAtoms: any, atoms: any, vBoxMin: any, vBoxMax: any, probeRadius: any);
    _numAtoms: any;
    _atoms: any;
    _vBoxMin: any;
    _vBoxMax: any;
    _probeRadius: any;
    _atomsList: Int32Array | null;
    _voxelList: any;
    createVoxels(): number;
    _numCells: number | undefined;
    _aveRad: number | undefined;
    _maxRad: number | undefined;
    _xScale: number | undefined;
    _yScale: number | undefined;
    _zScale: number | undefined;
    destroyVoxels(): void;
    _vertices: any;
    /**
     * Enumerate all atoms affecting specified point
     *
     * @param {Vector3}    point    - point in 3D
     * @param {func(atom)} process  - function to call for each atom
     */
    forEachRelatedAtom(point: Vector3, process: any): void;
    /**
     * Get atom closest to specified point
     *
     * @param {Vector3} point  - point in 3D
     *
     * @returns {IsoSurfaceAtomColored} atom, or null if not found
     */
    getClosestAtom(point: Vector3): IsoSurfaceAtomColored;
    /**
     * Build normals for isosurface, using atoms information
     *
     * @param {number} numVertices  - Number of vertices in final geometry (to render)
     * @param {Vector3} vertices    - Geometry vertices (3d coordinates array)
     * @param {Vector3} normals     - Normals for output
     *
     * @returns {number} 0, if success
     */
    buildNormals(numVertices: number, vertices: Vector3, normals: Vector3): number;
    /**
     * Build vertex colors for isosurface, using atoms information
     *
     * @param {number} numVertices  - Number of vertices in final geometry (to render)
     * @param {Vector3} vertices    - Geometry vertices (3d coordinates array)
     * @param {Vector3} colors                - Colors for output
     * @param {number} radiusColorSmoothness  - Radius of smoothness sphere
     *
     * @returns {number} 0, if success
     */
    buildColors(numVertices: number, vertices: Vector3, colors: Vector3, radiusColorSmoothness: number): number;
}
