export default CarbonColorer;
/**
 * Create new colorer.
 *
 * @param {object=} opts - Options to override defaults with. See {@link Colorer}.
 *
 * @exports CarbonColorer
 * @augments Colorer
 * @constructor
 * @classdesc Bicolor coloring algorithm based on selection carbon atoms.
 */
declare class CarbonColorer extends Colorer {
    static id: string;
    getAtomColor(atom: any, _complex: any): any;
    getResidueColor(_residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
