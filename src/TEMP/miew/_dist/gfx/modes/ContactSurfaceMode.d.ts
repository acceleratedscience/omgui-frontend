export default ContactSurfaceMode;
declare class ContactSurfaceMode extends SurfaceMode {
    static id: string;
    getSurfaceOpts(): {
        probeRadius: any;
        radScale: any;
        scaleFactor: any;
        gridSpacing: number;
        isoValue: any;
        probePositions: any;
        zClip: any;
        visibilitySelector: any;
    };
    name: string;
    shortName: string;
}
import SurfaceMode from "./SurfaceMode";
