export default XYZParser;
declare class XYZParser extends Parser {
    static canProbablyParse(data: any): boolean;
    static formats: string[];
    static extensions: string[];
    _complex: import("../../chem/Complex").default | null;
    _atomsInf: any;
    _fileName: any;
    _parseToAtomsInf(source: any): void;
    _parseAtomsInf(): void;
}
import Parser from "./Parser";
