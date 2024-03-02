export default IsoSurfaceMode;
declare class IsoSurfaceMode extends SurfaceMode {
    constructor(excludeProbe: any, opts: any);
    _excludeProbe: any;
    getSurfaceOpts(): {
        gridSpacing: any;
        radScale: number;
        zClip: any;
        visibilitySelector: any;
        probeRadius: any;
        excludeProbe: any;
    };
    name: string;
    shortName: string;
    _radScale: number;
}
import SurfaceMode from "./SurfaceMode";
