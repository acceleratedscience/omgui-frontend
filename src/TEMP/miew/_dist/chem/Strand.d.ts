export default Strand;
/**
 * A single strand of a sheet in a protein secondary structure.
 * @extends StructuralElement
 */
declare class Strand extends StructuralElement {
    /**
     * Create a strand.
     *
     * @param {Sheet} sheet Parent sheet this strand belongs to.
     * @param {Residue} init Initial residue.
     * @param {Residue} term Terminal residue.
     * @param {number} sense Sense of strand with respect to previous strand in the sheet.
     *   - 0 if the first strand,
     *   - 1 if parallel, and
     *   - -1 if anti-parallel.
     * @param {Atom} atomCur Atom in current strand (see PDB Format).
     * @param {Atom} atomPrev Atom in previous strand (see PDB Format).
     */
    constructor(sheet: Sheet, init: Residue, term: Residue, sense: number, atomCur: Atom, atomPrev: Atom);
    /**
     * Parent sheet this strand belongs to.
     * @type {Sheet}
     */
    sheet: Sheet;
    /**
     * Sense of strand with respect to previous strand in the sheet.
     * - 0 if the first strand,
     * - 1 if parallel, and
     * - -1 if anti-parallel.
     * @type {number}
     */
    sense: number;
    /**
     * Atom in current strand (see PDB Format).
     * @type {Atom}
     */
    atomCur: Atom;
    /**
     * Atom in previous strand (see PDB Format).
     * @type {Atom}
     */
    atomPrev: Atom;
}
import StructuralElement from "./StructuralElement";
