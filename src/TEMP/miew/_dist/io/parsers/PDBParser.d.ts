export default PDBParser;
declare class PDBParser extends Parser {
    static canProbablyParse(data: any): boolean;
    static tagParsers: {
        HEADER: (stream: any) => void;
        'TITLE ': (stream: any) => void;
        'ATOM  ': (stream: any) => void;
        HETATM: (stream: any) => void;
        ENDMDL: () => void;
        CONECT: (stream: any) => void;
        COMPND: (stream: any) => void;
        REMARK: (stream: any) => void;
        'HELIX ': (stream: any) => void;
        'SHEET ': (stream: any) => void;
        'ATOM 1': (stream: any) => void;
        'ATOM 2': (stream: any) => void;
        'ATOM 3': (stream: any) => void;
        'ATOM 4': (stream: any) => void;
        'ATOM 5': (stream: any) => void;
        'ATOM 6': (stream: any) => void;
        'ATOM 7': (stream: any) => void;
        'ATOM 8': (stream: any) => void;
        'ATOM 9': (stream: any) => void;
    };
    _complex: import("../../chem/Complex").default | null;
    _chain: any;
    _residue: any;
    _sheet: import("../../chem/Sheet").default | null;
    _serialAtomMap: {} | null;
    _modelId: number;
    _compaundFound: boolean;
    _biomoleculeFound: boolean;
    _allowedChainsIDs: any;
    _lastMolId: number;
    _remarks: {};
    _remark: any;
    _molecules: any[];
    _molecule: {
        _index: string;
        _chains: never[];
    } | null;
    _compndCurrToken: string;
    _finalize(): void;
    _finalizeMolecules(): void;
    _fixChains(): void;
    _fixBondsArray(): void;
    _parseATOM(stream: any): void;
    _parseENDMDL(): void;
    _parseCONECT(stream: any): void;
    _parseCOMPND(stream: any): void;
    _parseREMARK(stream: any): void;
    _parseHELIX(stream: any): void;
    _parseSHEET(stream: any): void;
    _parseSTRUCTURE(stream: any, pars: any, adder: any): void;
    _parseHEADER(stream: any): void;
    _parseTITLE(stream: any): void;
}
declare namespace PDBParser {
    const formats: string[];
    const extensions: string[];
}
import Parser from "./Parser";
