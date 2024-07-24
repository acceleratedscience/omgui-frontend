declare namespace _default {
    export { _calcCylinderMatrix as calcCylinderMatrix };
    export { _calcChunkMatrix as calcChunkMatrix };
    export { _groupHasGeometryToRender as groupHasGeometryToRender };
    export { _buildDistorionMesh as buildDistorionMesh };
    export { RCGroup };
    export { fillArray };
    export { clearTree };
    export { destroyObject };
    export { belongToSelectLayers };
    export { processObjRenderOrder };
    export { applySelectionMaterial };
    export { getMiddlePoint };
    export { LAYERS };
}
export default _default;
declare function _calcCylinderMatrix(posBegin: any, posEnd: any, radius: any): any;
declare function _calcChunkMatrix(eye: any, target: any, up: any, rad: any): any;
declare function _groupHasGeometryToRender(group: any): boolean;
declare function _buildDistorionMesh(widthSegments: any, heightSegements: any, coef: any): any;
import RCGroup from "./RCGroup";
declare function fillArray(array: any, value: any, startIndex: any, endIndex: any): void;
declare function clearTree(object: any): void;
declare function destroyObject(object: any): void;
declare function belongToSelectLayers(object: any): boolean;
declare function processObjRenderOrder(root: any, idMaterial: any): void;
declare function applySelectionMaterial(geo: any): void;
declare function getMiddlePoint(point1: any, point2: any, optionalTarget: any): any;
declare namespace LAYERS {
    const DEFAULT: number;
    const VOLUME: number;
    const TRANSPARENT: number;
    const PREPASS_TRANSPARENT: number;
    const VOLUME_BFPLANE: number;
    const COLOR_FROM_POSITION: number;
    const SHADOWMAP: number;
}
