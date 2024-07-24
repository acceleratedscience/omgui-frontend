export default Bond;
/**
 * Bond between atoms.
 *
 * @param {Atom} left     - The first atom.
 * @param {Atom} right    - The second atom.
 * @param {number} order - Order of current bond.
 * @param {number} type - Bond type.
 * @param {boolean} fixed - Indicator of a pre-specified connection (in contrast with guessed one).
 *
 * @exports Bond
 * @constructor
 */
declare class Bond {
    static BondType: {
        /** Was generated manually */
        UNKNOWN: number;
        /** Simple covalent bond */
        COVALENT: number;
        /** Aromatic bond */
        AROMATIC: number;
    };
    constructor(left: any, right: any, order: any, type: any, fixed: any);
    _left: any;
    _right: any;
    _fixed: any;
    _index: number;
    _order: any;
    _type: any;
    getLeft(): any;
    getRight(): any;
    getOrder(): any;
    calcLength(): any;
    _forEachNeighbour(currAtom: any, process: any): void;
    forEachLevelOne(process: any): void;
    forEachLevelTwo(process: any): void;
    _fixDir(refPoint: any, currDir: any, posGetter: any): any;
    calcNormalDir(posGetter: any): any;
    BondType: {
        /** Was generated manually */
        UNKNOWN: number;
        /** Simple covalent bond */
        COVALENT: number;
        /** Aromatic bond */
        AROMATIC: number;
    };
}
