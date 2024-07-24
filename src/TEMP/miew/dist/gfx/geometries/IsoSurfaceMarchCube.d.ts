export default IsoSurfaceMarchCube;
/**
 * Class for marching cube
 * Stores 8 points and 8 float values are stored together in linear array
 * Int values for has intersection or not - in integer32 linear array
 * Int values for bits flags - in integer32 linear array
 *
 */
declare class IsoSurfaceMarchCube {
    pointsValuesLinear: any;
    hasIntersection: any;
    bitsInside: any;
    create(numCellsPerSide: any): number;
    destroy(): void;
    striIndicesMarchCube: number[];
}
