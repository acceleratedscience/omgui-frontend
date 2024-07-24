export default Sheet;
/**
 * Sheet secondary structure of a protein.
 *
 * @param {string} name -
 * @param {number} width -
 *
 * @exports Sheet
 * @constructor
 */
declare class Sheet {
    constructor(name: any, width: any);
    _name: any;
    _width: any;
    _strands: any[];
    getName(): any;
    getWidth(): any;
    addStrand(strand: any): void;
    addEmptyStrand(): void;
    _finalize(serialAtomMap: any, residueHash: any, complex: any): void;
}
