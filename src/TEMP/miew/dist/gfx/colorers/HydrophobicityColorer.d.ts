export default HydrophobicityColorer;
declare class HydrophobicityColorer extends Colorer {
    static id: string;
    getAtomColor(atom: any, complex: any): any;
    getResidueColor(residue: any, _complex: any): any;
    name: string;
    shortName: string;
}
import Colorer from "./Colorer";
