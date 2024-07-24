export default ResiduesProcessor;
declare class ResiduesProcessor extends RCGroup {
    constructor(ResidueGroup: any, geoParams: any, complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any);
    _complex: any;
    checkResidue(residue: any, mask: any): number;
}
import RCGroup from "../../RCGroup";
