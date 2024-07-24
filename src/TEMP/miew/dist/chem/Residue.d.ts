export default Residue;
/**
 * Residue instance.
 *
 * @param {Chain} chain      - Chain this residue belongs to.
 * @param {ResidueType} type - Generic residue instance type.
 * @param {number} sequence  - Sequence ID.
 * @param {string} icode     - One character insertion code (usually space or A-Z).
 *
 * @exports Residue
 * @constructor
 */
declare class Residue {
    constructor(chain: any, type: any, sequence: any, icode: any);
    _chain: any;
    _component: any;
    _type: any;
    _sequence: any;
    _icode: any;
    _mask: number;
    _index: number;
    _atoms: any[];
    _secondary: any;
    _firstAtom: any;
    _leadAtom: any;
    _wingAtom: any;
    _lastAtom: any;
    _controlPoint: any;
    _midPoint: any;
    _wingVector: any;
    _cylinders: any;
    _isValid: boolean;
    _het: boolean;
    _molecule: any;
    temperature: number | null;
    occupancy: number | null;
    getChain(): any;
    getMolecule(): any;
    getType(): any;
    getSequence(): any;
    getSecondary(): any;
    getICode(): any;
    addAtom(name: any, type: any, xyz: any, role: any, het: any, serial: any, altLoc: any, occupancy: any, tempFactor: any, charge: any): Atom;
    getAtomCount(): number;
    forEachAtom(process: any): void;
    _findAtomByName(name: any): null;
    _findFirstAtomInList(names: any): null;
    collectMask(): void;
    getCylinderTargetList(): string[] | null;
    _detectLeadWing(dst: any, next: any, getAtomPosition: any): void;
    calcWing(prevLeadPos: any, currLeadPos: any, prevWingPos: any, prevWing: any): any;
    _innerFinalize(prevRes: any, prev: any, nextRes: any, dst: any, chainAsNucleic: any, getAtomPosition: any): void;
    _finalize2(prev: any, next: any, asNucleic: any): void;
    isConnected(anotherResidue: any): boolean;
    _finalize(): void;
}
import Atom from "./Atom";
