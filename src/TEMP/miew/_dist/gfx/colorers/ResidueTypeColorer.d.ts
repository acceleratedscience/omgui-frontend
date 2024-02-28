export default ResidueTypeColorer;
/**
 * Coloring algorithm based on residue type.
 *
 * @see ResidueType
 *
 * @exports ResidueTypeColorer
 * @constructor
 */
declare class ResidueTypeColorer extends Colorer {
    static id: string;
    getAtomColor(atom: any, complex: any): any;
    getResidueColor(residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
