export default IsoSurfaceAtomColored;
/**
 * Class for colored atom. Need for atom structure clusterization
 *
 * @param {Vector3} vCenter   Center of atom
 * @param {number}  radiusAt  Radius of atom
 */
declare class IsoSurfaceAtomColored {
    constructor(vCenter: any, radiusAt: any);
    coord: any;
    radius: any;
    colorX: number;
    colorY: number;
    colorZ: number;
    atomType: number;
    srcAtom: any;
}
