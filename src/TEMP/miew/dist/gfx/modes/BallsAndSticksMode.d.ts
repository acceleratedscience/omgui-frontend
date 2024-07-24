export default BallsAndSticksMode;
declare class BallsAndSticksMode extends Mode {
    static id: string;
    calcAtomRadius(atom: any): number;
    calcStickRadius(): any;
    getAromRadius(): any;
    showAromaticLoops(): any;
    calcSpaceFraction(): any;
    drawMultiorderBonds(): any;
    name: string;
    shortName: string;
}
import Mode from "./Mode";
