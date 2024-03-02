export default CMLParser;
declare class CMLParser extends Parser {
    static canProbablyParse(data: any): boolean;
    _complex: import("../../chem/Complex").default | null;
    _residue: any;
    _serialAtomMap: {} | null;
    _modelId: number;
    _lastMolId: number;
    _readOnlyOneMolecule: boolean;
    _rebuidBondIndexes(atoms: any, bonds: any): void;
    _createSGroup(molecule: any, moleculeArr: any): void;
    _extractSGroup(molecule: any, moleculeArr: any): any;
    _extractSGroups(molecule: any, atoms: any): void;
    _traverseData(dom: any): {};
    _findSuitableMolecule(data: any, molSet: any): void;
    _selectComponents(text: any): any[];
    _packLabel(compId: any, molId: any): any;
    _unpackLabel(l: any): {
        molId: number;
        compId: number;
    };
    _breadWidthSearch(atoms: any, molID: any): {
        atomLabels: any[];
        labelsCount: number;
    };
    _parseBond(eAtom: any, mainAtom: any, order: any, type: any): void;
    _fixBondsArray(): void;
    _parseSet(varData: any): import("../../chem/Complex").default;
}
declare namespace CMLParser {
    const formats: string[];
    const extensions: string[];
}
import Parser from "./Parser";
