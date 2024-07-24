export default ContactSurfaceGeometry;
/**
 * This class implements 'contact' isosurface geometry generation algorithm.
 * @param spheresCount - number of atoms/spheres
 * @param opts - geometry specific options
 * @constructor
 */
declare class ContactSurfaceGeometry extends VolumeSurfaceGeometry {
    _computeSurface(packedArrays: any, box: any, boundaries: any, params: any): {
        volMap: import("../../chem/Volume").default;
        volTexMap: import("../../chem/Volume").default;
        atomMap: any;
        atomWeightMap: import("../../chem/Volume").default;
    };
}
import VolumeSurfaceGeometry from "./VolumeSurfaceGeometry";
