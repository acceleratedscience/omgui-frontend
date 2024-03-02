export const typeByPDBHelixClass: {
    1: string;
    3: string;
    5: string;
};
export default Helix;
/**
 * Helical secondary structure of a protein.
 * @extends StructuralElement
 */
declare class Helix extends StructuralElement {
    /**
     * Create a helix.
     *
     * @param {number} helixClass A helix class according to the
     *   [PDB Format](http://www.wwpdb.org/documentation/file-format-content/format33/sect5.html#HELIX).
     * @param {Residue} init Initial residue.
     * @param {Residue} term Terminal residue.
     * @param {number} serial Serial number of the helix (see PDB Format).
     * @param {string} name Helix identifier (see PDB Format).
     * @param {string} comment Comment about this helix (see PDB Format).
     * @param {number} length Length of this helix, in residues (see PDB Format).
     */
    constructor(helixClass: number, init: Residue, term: Residue, serial: number, name: string, comment: string, length: number);
    /**
     * Serial number of the helix (see PDB Format).
     * @type {number}
     */
    serial: number;
    /**
     * Helix identifier (see PDB Format).
     * @type {string}
     */
    name: string;
    /**
     * Comment about this helix (see PDB Format).
     * @type {string}
     */
    comment: string;
    /**
     * Length of this helix, in residues (see PDB Format).
     * @type {number}
     */
    length: number;
}
import StructuralElement from "./StructuralElement";
