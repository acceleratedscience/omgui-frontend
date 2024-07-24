export default ConditionalColorer;
/**
 * Create new colorer.
 *
 * @param {object=} opts - Options to override defaults with. See {@link Colorer}.
 *
 * @exports ConditionalColorer
 * @augments Colorer
 * @constructor
 * @classdesc Bicolor coloring algorithm based on a selector string used as a condition.
 */
declare class ConditionalColorer extends Colorer {
    static id: string;
    _subsetCached: any;
    getAtomColor(atom: any, _complex: any): any;
    getResidueColor(residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
