export default UniformColorer;
declare class UniformColorer extends Colorer {
    static id: string;
    getAtomColor(_atom: any, _complex: any): any;
    getResidueColor(_residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
