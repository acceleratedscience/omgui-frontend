export default VoxelWorld;
/**
 * VoxelWorld constructor
 *
 * @param {Box3} box - bounding box of the volume to be partitioned
 * @param {Vector3} vCellSizeHint - target voxel size (actual voxel size may differ from this)
 */
declare class VoxelWorld {
    /**
     * Get voxel that contains specified 3D point (we use clamp at the edges)
     *
     * @param {Vector3} point - a point in 3D
     * @returns {number} - index of voxel
     */
    static _zero: any;
    static _voxel: any;
    /**
     * Call a function for each voxel that is touched by given sphere. Callback also takes flag
     * isInside specifying whether voxel lies inside the sphere entirely.
     *
     * @param {Vector3} center - center of the sphere
     * @param {number} radius  - sphere radius
     * @param {function(number,bool)} process - function to call that takes voxel index and boolean isInside
     */
    static _xRange: any;
    static _yRange: any;
    static _zRange: any;
    /**
     * Call a function for each voxel that is touched by given sphere. Callback also takes flag
     * isInside specifying whether voxel lies inside the sphere entirely.
     * This is a version of method that doesn't try to "calculate" what voxels fall inside radius
     * but instead just checks all voxels inside sphere's bounding box. This should be faster
     * unless cell size is much smaller than sphere radius.
     *
     * @param {Vector3} center - center of the sphere
     * @param {number} radius  - sphere radius
     * @param {function(number,bool)} process - function to call that takes voxel index and boolean isInside
     */
    static _vCenter: any;
    constructor(box: any, vCellSizeHint: any);
    _box: any;
    _count: any;
    _last: any;
    _cellSize: any;
    _cellInnerR: number;
    _cellOuterR: number;
    _voxels: any;
    _atoms: any[];
    /**
     * Add all atoms from a complex to voxel world
     *
     * @param {Complex} complex - complex
     */
    addAtoms(complex: Complex): void;
    _findVoxel(point: any): any;
    /**
     * Call a function for each atom in voxel
     *
     * @param {number} voxel - index of voxel
     * @param {function(Atom)} process - function to call
     */
    _forEachAtomInVoxel(voxel: number, process: (arg0: Atom) => any): void;
    _forEachVoxelWithinRadius(center: any, radius: any, process: any): void;
    _forEachVoxelWithinRadiusSimple(center: any, radius: any, process: any): void;
    /**
     * Call a function for each atom within given sphere
     *
     * @param {Vector3} center - center of the sphere
     * @param {number} radius  - sphere radius
     * @param {function(Atom)} process - function to call
     */
    forEachAtomWithinRadius(center: Vector3, radius: number, process: (arg0: Atom) => any): void;
    /**
     * Call a function for each atom of given complex within given distance from group of atoms defined by mask
     *
     * @param {Complex} complex - complex
     * @param {number} mask - bit mask
     * @param {number} dist - distance
     * @param {function(Atom)} process - function to call
     */
    forEachAtomWithinDistFromMasked(complex: Complex, mask: number, dist: number, process: (arg0: Atom) => any): void;
    /**
     * Call a function for each atom of given complex within given distance from group of atoms defined by selector
     *
     * @param {Complex} complex - complex
     * @param {number} selector - selector
     * @param {number} dist - distance
     * @param {function(Atom)} process - function to call
     */
    forEachAtomWithinDistFromSelected(complex: Complex, selector: number, dist: number, process: (arg0: Atom) => any): void;
    /**
     * Call a function for each atom of given complex within given distance from group of atoms
     *
     * @param {function} forEachAtom - enumerator of atoms in the group
     * @param {number} dist - distance
     * @param {function(Atom)} process - function to call
     */
    _forEachAtomWithinDistFromGroup(forEachAtom: Function, dist: number, process: (arg0: Atom) => any): void;
}
