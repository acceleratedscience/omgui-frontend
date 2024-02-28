export default MMTFParser;
declare class MMTFParser extends Parser {
    static canProbablyParse(data: any): boolean;
    _onModel(_modelData: any): void;
    _onChain(chainData: any): void;
    _onGroup(groupData: any): void;
    _onAtom(atomData: any): void;
    _onBond(bondData: any): void;
    _updateSecStructure(complex: any, residue: any, groupData: any): void;
    _ssType: any;
    _ssStart: any;
    _ssStruct: StructuralElement | null | undefined;
    _updateMolecules(mmtfData: any): void;
    _traverse(mmtfData: any): void;
    _linkAtomsToResidues(): void;
    _findSynonymousChains(): {};
    _parseAssemblyInfo(mmtfData: any): import("../../chem/Assembly").default[];
    _markHeteroAtoms(mmtfData: any): void;
    _joinSynonymousChains(): void;
    _complex: import("../../chem/Complex").default | undefined;
    _serialAtomMap: {} | undefined;
    _chainsByName: {} | undefined;
}
declare namespace MMTFParser {
    const formats: string[];
    const extensions: string[];
    const binary: boolean;
}
import Parser from "./Parser";
import StructuralElement from "../../chem/StructuralElement";
