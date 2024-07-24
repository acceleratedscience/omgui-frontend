export default CartoonMode;
declare class CartoonMode extends Mode {
    static id: string;
    secCache: {};
    getResidueStartRadius(residue: any): any;
    getResidueEndRadius(residue: any): any;
    getResidueRadius(residue: any, val: any): any;
    calcStickRadius(_res: any): any;
    getHeightSegmentsRatio(): any;
    getTension(): any;
    TUBE_RADIUS: any;
    ARROW_END: any;
    name: string;
    shortName: string;
}
import Mode from "./Mode";
