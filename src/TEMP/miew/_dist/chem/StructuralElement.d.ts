export default StructuralElement;
/** An element of protein secondary structure. */
declare class StructuralElement {
    /**
     * Create a secondary structural element of the specified type.
     *
     * @param {StructuralElement.Type} type Secondary structure type.
     * @param {Residue} init Initial residue.
     * @param {Residue} term Terminal residue.
     */
    constructor(type: StructuralElement.Type, init: Residue, term: Residue);
    /**
     * Secondary structure type.
     * @type {StructuralElement.Type}
     */
    type: StructuralElement.Type;
    /**
     * Generic secondary structure type.
     * @type {StructuralElement.Generic}
     */
    generic: StructuralElement.Generic;
    /**
     * Initial residue.
     * @type Residue
     */
    init: Residue;
    /**
     * Terminal residue.
     * @type Residue
     */
    term: Residue;
    /**
     * An internal method for making a final pass over the complex to set all required references.
     *
     * **NOTE:** I'm sorry. It's a legacy code waiting for refactoring.
     * Just copying it as-is right now and hoping for the best.
     *
     * @param {object} serialAtomMap A dictionary of atoms
     * @param {object} residueHash A dictionary of hashed residues to check.
     * @param {Complex} complex The molecular complex this element belongs to.
     */
    _finalize(serialAtomMap: object, residueHash: object, complex: Complex): void;
}
declare namespace StructuralElement {
    namespace Type {
        const STRAND: string;
        const BRIDGE: string;
        const HELIX_310: string;
        const HELIX_ALPHA: string;
        const HELIX_PI: string;
        const HELIX: string;
        const TURN_310: string;
        const TURN_ALPHA: string;
        const TURN_PI: string;
        const TURN: string;
        const BEND: string;
        const COIL: string;
    }
    /**
     * *
     */
    type Type = string;
    namespace Generic {
        const STRAND_1: string;
        export { STRAND_1 as STRAND };
        const HELIX_1: string;
        export { HELIX_1 as HELIX };
        export const LOOP: string;
    }
    /**
     * *
     */
    type Generic = string;
    const genericByType: any;
}
import Residue from "./Residue";
