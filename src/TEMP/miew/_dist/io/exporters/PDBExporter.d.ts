declare class PDBExporter extends Exporter {
    _tags: string[];
    _result: string | null;
    _tagExtractors: {
        HEADER: (result: any) => void;
        TITLE: (result: any) => void;
        'ATOM and HETATM': (result: any) => void;
        CONECT: (result: any) => void;
        COMPND: (result: any) => void;
        REMARK: (result: any) => void;
        HELIX: (result: any) => void;
        SHEET: (result: any) => void;
    };
    _stringForRemark350: string;
    _stringForRemark290: string;
    _extractHEADER(result: any): void;
    _extractTITLE(result: any): void;
    _extractCONECT(result: any): void;
    _extractSHEET(result: any): void;
    _extractHELIX(result: any): void;
    _extractATOM(result: any): void;
    _extractCOMPND(result: any): void;
    _extractREMARK(result: any): void;
    _Remark290(result: any): void;
    _Remark350(result: any): void;
    _getMoleculeChains(molecule: any): any;
}
declare namespace PDBExporter {
    export const formats: string[];
    export { Complex as SourceClass };
}
export default PDBExporter;
import Exporter from "./Exporter";
import Complex from "../../chem/Complex";
