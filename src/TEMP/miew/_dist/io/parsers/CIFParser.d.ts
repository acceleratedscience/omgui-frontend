export default CIFParser;
declare class CIFParser extends Parser {
    static canProbablyParse(data: any): boolean;
    asymDict: {};
    molecules: any[];
    /**
     * Convert intermediate structure into our valid Complex object
     * @param cifData intermediate CIF object
     * @returns {Complex} complex
     * @private
     */
    private _toComplex;
    /**
     * Extract metadata
     * @param complex structure to fill
     * @param complexData complex data from CIF file
     * @private
     */
    private _extractMetadata;
    /**
     * Extract molecules information from CIF structure (should be called strictly after _extractAtoms)
     * @param complexData complex data from CIF file
     * @private
     */
    private _extractMolecules;
    /**
     * Extract atom information from CIF structure and fill complex
     * @param {Complex} complex
     * @param complexData complex data from CIF file
     * @private
     */
    private _extractAtoms;
    /**
     * Extracts secondary structure information from CIF intermediate data
     * and adds it into complex
     * @param {Complex} complex - complex to fill
     * @param complexData - CIF complex data
     * @private
     */
    private _extractSecondary;
    /**
     * Extracts sheets information from CIF intermediate data
     * and adds it into complex
     * @param {Complex} complex
     * @param sheetData
     * @private
     */
    private _extractSheets;
    /**
     * Extracts helix/turn/strand(?) information from CIF intermediate data
     * and adds it into complex
     * @param {Complex} complex
     * @param helicesData
     * @private
     */
    private _extractConfs;
    /**
     * Extract biological assemblies information from CIF structure and fill complex
     * @param {Complex} complex
     * @param complexData complex data from CIF file
     * @private
     */
    private _extractAssemblies;
}
declare namespace CIFParser {
    const formats: string[];
    const extensions: string[];
}
import Parser from "./Parser";
