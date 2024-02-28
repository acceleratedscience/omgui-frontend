export default TemperatureColorer;
/**
 * Create new colorer.
 *
 * @param {object=} opts - Options to override defaults with. See {@link Colorer}.
 *
 * @see Temperature
 *
 * @exports TemperatureColorer
 * @augments Colorer
 * @constructor
 * @classdesc Coloring algorithm based on temperature of chemical element.
 */
declare class TemperatureColorer extends Colorer {
    static id: string;
    getAtomColor(atom: any, _complex: any): any;
    getResidueColor(residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
