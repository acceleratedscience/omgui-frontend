export default SurfaceMode;
declare class SurfaceMode extends Mode {
    calcAtomRadius(atom: any): any;
    getVisibilitySelector(): any;
    isSurface: boolean;
    surfaceNames: any[];
}
import Mode from "./Mode";
