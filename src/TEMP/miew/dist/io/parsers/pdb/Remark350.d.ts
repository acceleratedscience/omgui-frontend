export default Remark350;
/**
 * Parser helper for PDB tag "REMARK 350".
 *
 * @exports Remark350
 * @constructor
 */
declare class Remark350 {
    constructor(complex: any);
    /** @type {Complex} */
    _complex: Complex;
    /** @type {Assembly[]} */
    assemblies: typeof import("../../../chem/Assembly").default[];
    /** @type {?Assembly} */
    _assembly: typeof import("../../../chem/Assembly").default | null;
    /** @type {?Matrix4} */
    _matrix: Matrix4 | null;
    /** @type {number} */
    _matrixIndex: number;
    /**
     * Parse a single line of a stream.
     * @param {PDBStream} stream - stream to parse
     */
    parse(stream: PDBStream): void;
    id: number;
}
