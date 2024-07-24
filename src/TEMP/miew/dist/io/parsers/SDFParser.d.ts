declare class SDFParser extends Parser {
    _format: string;
    _complex: import("../../chem/Complex").default | null;
    _chain: any;
    _residue: any;
    _molecules: any;
    _metadata: {};
    _currentMolProps: {};
    _compoundIndx: number;
    _assemblies: any[];
    _atomsParsed: number;
    _atomsIndexes: any[];
    canProbablyParse(data: any): boolean;
    _parseHeader(stream: any): void;
    _parseAtoms(stream: any, atomsNum: any): void;
    _parseBonds(stream: any, bondsNum: any): void;
    _parseMOL(stream: any): void;
    _parseDataItem(stream: any): void;
    _parseCompound(stream: any): void;
    _fixBondsArray(): void;
    _buildAssemblies(): any[];
    _buildMolecules(): any[];
    _searchTag(tag: any, props: any): any;
    _tryToFind(tagsList: any, props: any): any;
    _tryToUpdateMoleculeData(molecule: any): boolean;
    _finalizeMetadata(): void;
    _finalize(): void;
    _serialAtomMap: {} | undefined;
    defineFormat(data: any): string;
}
declare namespace SDFParser {
    const formats: string[];
    const extensions: string[];
}
export default SDFParser;
import Parser from "./Parser";
