export default VolumeSurfaceGeometry;
/**
 * This is a base class for volumetric maps based isosurface algorithms.
 * @param spheresCount - number of atoms/spheres
 * @param opts - geometry specific options
 * @constructor
 */
declare class VolumeSurfaceGeometry extends IsoSurfaceGeometry {
    _build(): void;
    numVoxels: number[] | undefined;
    xAxis: any;
    yAxis: any;
    zAxis: any;
    origin: any;
    _visibilitySelector: any;
    _findMinMax(posRadArray: any): {
        maxPosRad: any[];
        minPosRad: any[];
    };
    _findNumVoxels(posRadArray: any, params: any): {
        bbox: {
            maxPosRad: any[];
            minPosRad: any[];
        };
        dim: number[] | undefined;
    };
    _makeSurface(surface: any, params: any): void;
    _calcSurface(params: any): void;
}
import IsoSurfaceGeometry from "./IsoSurfaceGeometry";
