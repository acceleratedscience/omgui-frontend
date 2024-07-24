export default MOL2Parser;
declare class MOL2Parser extends Parser {
    _complex: import("../../chem/Complex").default | null;
    _chain: any;
    _residue: any;
    _compoundIndx: number;
    _molecules: any[];
    _molecule: {
        _index: string;
        _chains: never[];
    } | null;
    _currPosIdx: number;
    _currStartIdx: number;
    _serialAtomMap: {};
    _parseRawStrings(data: any): any;
    _toStringFromStart(numb: any, MOL2Data: any): void;
    _toHeaderString(header: any, MOL2Data: any): void;
    _toStringFromHeader(header: any, numb: any, MOL2Data: any): void;
    _setStart(startPos: any, MOL2Data: any): void;
    _probablyHaveDataToParse(MOL2Data: any): boolean;
    _findNextCompoundStart(MOL2Data: any): boolean;
    _parseMolecule(MOL2Data: any): void;
    _parseAtoms(atomsNum: any, MOL2Data: any): void;
    _setResidue(parsedStr: any): boolean;
    _parseBonds(bondsNum: any, MOL2Data: any): void;
    _fixSerialAtoms(): void;
    _fixBondsArray(): void;
    _finalizeMolecules(): void;
    _finalize(): void;
    _parseCompound(MOL2Data: any): void;
}
declare namespace MOL2Parser {
    const formats: string[];
    const extensions: string[];
}
import Parser from "./Parser";
