export default BondsGroup;
declare class BondsGroup extends ChemGroup {
    getBondOrder(bond: any, drawMultiple: any, showAromatic: any): number;
    _calcChunksList(mask: any, innerOnly: any): number[];
}
import ChemGroup from "./ChemGroup";
