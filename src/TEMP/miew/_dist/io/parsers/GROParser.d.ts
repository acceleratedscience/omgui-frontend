export default GROParser;
/**
 * Gromos87 file format parser.
 * @extends Parser
 */
declare class GROParser extends Parser {
    /**
     * Create parser for .gro file format
     *
     * @param {String} data Input file
     * @param {String} options Input options (optional field)
     */
    constructor(data: string, options: string);
    /** @type Date */
    _time: Date;
    /** @type Number */
    _numAtoms: number;
    /** @type Number */
    _residueNumber: number;
    /** @type String */
    _residueName: string;
    /** @type String */
    _atomName: string;
    /** @type Number */
    _atomNumber: number;
    /** @type Array */
    _atomPosition: any[];
    /** @type Array */
    _atomVelocity: any[];
    /** @type Complex */
    _complex: typeof import("../../chem/Complex").default;
    /** @type Vector3 */
    _molecules: Vector3;
    /** @type Molecule */
    _molecule: typeof import("../../chem/Molecule").default;
    /**
     * General check for possibility of parsing.
     * @param {String} data - Input file
     * @returns {boolean} true if this file is in ascii, false otherwise
     */
    canProbablyParse(data: string): boolean;
    /**
     * Parsing title of molecule complex.
     * NOTE: that names are ESTIMATES, there is no strict rules in Gromos87 standard for first line in input file.
     * @param {GROReader} line - Line containing title and time.
     */
    _parseTitle(line: GROReader): void;
    /**
     * Parsing line containing number of atoms information.
     * @param {GROReader} line - Line containing number of atoms.
     */
    _parseNumberOfAtoms(line: GROReader): void;
    /**
     * Parsing line containing information about residues, atoms etc. Also information about box vectors.
     * Format of atoms MUST (by Gromos87 standard) be this: (note that numbering starts not from 0, but from 1!)
     * ResidueNumber[1 - 5]  ResidueName[6 - 10] AtomName[11 - 15] AtomNumber[16 - 20] Position[21 - 45] Velocity[46 - 69]
     * @param {GROReader} line - Line containing information about atom.
     */
    _parseAtom(line: GROReader): void;
    _chain: any;
    _residue: any;
    /**
     * Some finalizing procedures. In '.gro' file format there is only 1 chain and 1 molecule.
     */
    _finalize(): void;
}
declare namespace GROParser {
    const formats: string[];
    const extensions: string[];
}
import Parser from "./Parser";
import GROReader from "./GROReader";
