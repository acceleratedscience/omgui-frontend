/** Base class for fbx geometry contains simply organized attributes: positions+normals+colors, indices. */
export default class FBXGeometry {
    positions: any;
    normals: any;
    colors: any;
    indices: any;
    vertsCount: number;
    itemSize: {
        position: any;
        normal: any;
        color: any;
    } | null;
    /**
     * Initialize base geo storing items info from attributes.
     * @param {Object} geo - THREE.BufferGeometry.
     */
    init(geo: any, _info: any): void;
}
