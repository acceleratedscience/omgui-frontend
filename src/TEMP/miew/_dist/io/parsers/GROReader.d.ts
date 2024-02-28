export default GROReader;
/**
 * Little helper class for GRO Parser usage.
 * @extends PDBStream
 */
declare class GROReader extends PDBStream {
    constructor(data: any);
    /**
     * Getting end of string.
     * @returns {Number} Pointer to end of string
     */
    getNext(): number;
}
import PDBStream from "./PDBStream";
