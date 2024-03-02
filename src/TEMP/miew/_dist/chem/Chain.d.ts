export default Chain;
/**
 * Residue chain.
 *
 * @param {Complex} complex - Molecular complex this chain belongs to.
 * @param {string} name - One character identifier (usually space, A-Z, 0-9, or a-z).
 *
 * @exports Chain
 * @constructor
 */
declare class Chain {
    constructor(complex: any, name: any);
    _complex: any;
    _name: any;
    _mask: number;
    _index: number;
    _residues: any[];
    minSequence: number;
    maxSequence: number;
    getComplex(): any;
    getName(): any;
    getResidues(): any[];
    _determineType(): void;
    type: number | undefined;
    /**
     * Finds thre residue with specified sequence number and inserion code
     * @param {Number} seqNum sequence number
     * @param {string} iCode insertion code
     * @returns {*} Residue or null if not found
     */
    findResidue(seqNum: number, iCode: string): any;
    _finalize(): void;
    updateToFrame(frameData: any): void;
    /**
     * Create a new residue.
     *
     * @param {string} name - Residue name.
     * @param {number} sequence - Residue sequence number.
     * @param {string} iCode - Insertion code.
     * @returns {Residue} - Newly created residue instance.
     */
    addResidue(name: string, sequence: number, iCode: string): Residue;
    getResidueCount(): number;
    forEachResidue(process: any): void;
    collectMask(): void;
}
import Residue from "./Residue";
