export default PDBStream;
/** Helper class for stream-like reading input files. */
declare class PDBStream {
    /**
     * Create a stream
     * @param {String} data Input data
     */
    constructor(data: string);
    /** @type String */
    _data: string;
    /** @type Number */
    _start: number;
    /** @type Number */
    _nextCR: number;
    /** @type Number */
    _nextLF: number;
    /** @type Number */
    _next: number;
    /** @type Number */
    _end: number;
    /**
     * Reading next line.
     * @returns {String} Next line in data (ending with LF or CR)
     */
    readLine(): string;
    /**
     * Reading character from position.
     * @param {Number} pos - Position in current line.
     * @returns {String} Character from position
     */
    readChar(pos: number): string;
    /**
     * Reading character code from position.
     * @param {Number} pos - Position in current line.
     * @returns {Number} Character code from position
     */
    readCharCode(pos: number): number;
    /**
     * Reading string from begin to end points.
     * For a reason unknown, numbering assumed not to start from 0, but from 1.
     * @param {Number} begin - Begin point in current line.
     * @param {Number} end - End point in current line.
     * @returns {String} String from begin to end
     */
    readString(begin: number, end: number): string;
    /**
     * Reading integer from begin to end points.
     * @param {Number} begin - Begin point in current line.
     * @param {Number} end - End point in current line.
     * @returns {Number} Integer from begin to end
     */
    readInt(begin: number, end: number): number;
    /**
     * Reading float from begin to end points.
     * @param {Number} begin - Begin point in current line.
     * @param {Number} end - End point in current line.
     * @returns {Number} Float from begin to end
     */
    readFloat(begin: number, end: number): number;
    /**
     * Checking for end of data.
     * @returns {boolean} True if data is ended, false otherwise
     */
    end(): boolean;
    /**
     * Procedure to re-arrange current pointers in data.
     */
    next(): void;
}
