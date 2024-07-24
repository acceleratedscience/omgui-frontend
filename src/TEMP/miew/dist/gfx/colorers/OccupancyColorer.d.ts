export default OccupancyColorer;
/**
 * Create new colorer.
 *
 * @param {object=} opts - Options to override defaults with. See {@link Colorer}.
 *
 * @see Occupancy
 *
 * @exports OccupancyColorer
 * @arguments Occupancy
 * @constructor
 * @classdesc Coloring algorithm based on occupancy of chemical element.
 */
declare class OccupancyColorer extends Colorer {
    static id: string;
    _getColorByOccupancy(occupancy: any, opts: any): any;
    getAtomColor(atom: any, _complex: any): any;
    getResidueColor(residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
