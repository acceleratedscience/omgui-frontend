export default LinesMode;
declare class LinesMode extends Mode {
    static id: string;
    drawMultiorderBonds(): any;
    calcAtomRadius(): any;
    getAromaticOffset(): any;
    getAromaticArcChunks(): any;
    showAromaticLoops(): any;
    name: string;
    shortName: string;
}
import Mode from "./Mode";
