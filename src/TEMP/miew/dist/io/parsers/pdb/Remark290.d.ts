export default Remark290;
declare class Remark290 {
    /** @type {Matrix4[]} */
    matrices: Matrix4[];
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
