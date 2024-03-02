export default ElementColorer;
/**
 * Create new colorer.
 *
 * @param {object=} opts - Options to override defaults with. See {@link Colorer}.
 *
 * @see Element
 *
 * @exports ElementColorer
 * @augments Colorer
 * @constructor
 * @classdesc Coloring algorithm based on chemical element.
 */
declare class ElementColorer extends Colorer {
    static id: string;
    getAtomColor(atom: any, _complex: any): any;
    getResidueColor(_residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
