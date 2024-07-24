export default TubeMode;
declare class TubeMode extends Mode {
    static id: string;
    getResidueRadius(_residue: any): any;
    getHeightSegmentsRatio(): any;
    getTension(): any;
    TUBE_RADIUS: any;
    name: string;
    shortName: string;
}
import Mode from "./Mode";
