export default LicoriceMode;
declare class LicoriceMode extends Mode {
    static id: string;
    calcAtomRadius(_atom: any): any;
    calcStickRadius(): any;
    calcSpaceFraction(): any;
    getAromRadius(): any;
    showAromaticLoops(): any;
    drawMultiorderBonds(): any;
    name: string;
    shortName: string;
}
import Mode from "./Mode";
