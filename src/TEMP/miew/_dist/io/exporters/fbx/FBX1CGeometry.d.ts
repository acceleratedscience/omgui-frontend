/**
 * Fbx geometry, that copies positions+normals, indexes and creates colors filled with defined value.
 * @extends FBXGeometry
 */
export default class FBX1CGeometry extends FBXGeometry {
    /**
     * Set defined color for all items in color attribute
     * @param {Object} color - THREE.Color.
     */
    setColors(color: any): void;
}
import FBXGeometry from "./FBXGeometry";
