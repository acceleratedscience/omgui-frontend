export default VanDerWaalsMode;
declare class VanDerWaalsMode extends Mode {
    static id: string;
    calcAtomRadius(atom: any): any;
    name: string;
    shortName: string;
}
import Mode from "./Mode";
