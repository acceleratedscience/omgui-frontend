export default AtomsProcessor;
declare class AtomsProcessor extends RCGroup {
    constructor(AtomsGroup: any, geoParams: any, complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any);
    _complex: any;
    _mode: any;
    _checkAtom(atom: any, mask: any): number;
}
import RCGroup from "../../RCGroup";
