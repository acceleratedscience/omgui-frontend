/**
 * Fbx geometry, that copies positions+normals, indexes from cylinder  geometry and creates colors filled with two
 * defined values.
 * @extends FBXGeometry
 */
export default class FBX2CCylinder extends FBXGeometry {
    _cutRawStart: number;
    _cutRawEnd: number;
    _facesPerSlice: number;
    /** Extend vertex attributes to have one more slice to make sharp middle startColor-endColor line. */
    _extendVertices(geo: any, info: any): void;
    /** Shift values of second part (+caps) indices by newly added vertices count. Number of faces remains the same. */
    _extendIndices(geo: any, info: any): void;
    /**
     * Set defined colors: (first part + bottom cap), (second part + top cap)
     * @param {number} start - start color index
     * @param {number} end - start color index
     * @param {array} array - array of colors
     * @param {array} color - color value components
     */
    _setColorRange(start: number, end: number, array: any[], color: any[]): void;
    /**
     * Set defined colors: (first part + bottom cap), (second part + top cap)
     * @param {Object} color1 - THREE.Color.
     * @param {Object} color2 - THREE.Color.
     */
    setColors(color1: any, color2: any): void;
}
import FBXGeometry from "./FBXGeometry";
