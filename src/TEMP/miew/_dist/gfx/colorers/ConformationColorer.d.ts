export default ConformationColorer;
declare class ConformationColorer extends Colorer {
    static id: string;
    getAtomColor(atom: any, _complex: any): any;
    getResidueColor(_residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
