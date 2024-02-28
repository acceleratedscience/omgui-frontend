export default PubChemParser;
declare class PubChemParser extends Parser {
    static canProbablyParse(data: any): boolean;
    _toComplex(jsonData: any): import("../../chem/Complex").default;
    _extractAtoms(complex: any, complexData: any): void;
}
declare namespace PubChemParser {
    const formats: string[];
    const extensions: string[];
}
import Parser from "./Parser";
