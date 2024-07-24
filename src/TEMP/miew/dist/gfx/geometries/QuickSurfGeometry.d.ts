export default QuickSurfGeometry;
/**
 * This class implements 'quick' isosurface geometry generation algorithm.
 * @param spheresCount - number of atoms/spheres
 * @param opts - geometry specific options
 * @constructor
 */
declare class QuickSurfGeometry extends VolumeSurfaceGeometry {
    _computeSurface(packedArrays: any, box: any, boundaries: any, params: any): {
        volMap: import("../../chem/Volume").default;
        volTexMap: import("../../chem/Volume").default;
    };
    gaussdensity(surface: any, packedArrays: any, atomicNum: any, params: any): void;
    _shiftByOrigin(posRadArray: any): void;
}
import VolumeSurfaceGeometry from "./VolumeSurfaceGeometry";
