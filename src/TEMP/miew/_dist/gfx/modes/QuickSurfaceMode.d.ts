export default QuickSurfaceMode;
declare class QuickSurfaceMode extends SurfaceMode {
    static id: string;
    getSurfaceOpts(): {
        useBeads: boolean;
        isoValue: any;
        gaussLim: any;
        radScale: any;
        gridSpacing: any;
        zClip: any;
        visibilitySelector: any;
    };
    name: string;
    shortName: string;
}
import SurfaceMode from "./SurfaceMode";
