declare namespace _default {
    export { applyTransformsToMeshes };
    export { processTransparentMaterial };
    export { processColFromPosMaterial };
    export { createShadowmapMaterial };
    export { removeShadowmapMaterial };
    export { forEachMeshInGroup };
    export { countTriangles };
}
export default _default;
declare function applyTransformsToMeshes(root: any, mtc: any): void;
declare function processTransparentMaterial(root: any, material: any): void;
declare function processColFromPosMaterial(root: any, material: any): void;
declare function createShadowmapMaterial(root: any, material: any): void;
declare function removeShadowmapMaterial(root: any, material: any): void;
declare function forEachMeshInGroup(group: any, process: any): void;
declare function countTriangles(group: any): number;
