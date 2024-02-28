export default Molecule;
/**
 * Residue Molecule.
 *
 * @param {Complex} complex - Molecular complex this Molecule belongs to.
 * @param {String} name - Molecule's name.
 * @param {Integer} index - Molecule's index in file.
 *
 * @exports Molecule
 * @constructor
 */
declare class Molecule {
    constructor(complex: any, name: any, index: any);
    complex: any;
    name: any;
    residues: any[];
    mask: number;
    index: any;
    forEachResidue(process: any): void;
    collectMask(): void;
}
