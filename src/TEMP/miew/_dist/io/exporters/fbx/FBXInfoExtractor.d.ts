export default class FBXInfoExtractor {
    _materials: any[];
    _models: any[];
    process(data: any): {
        name: any;
        models: any[];
        materials: any[];
    };
    /**
     * Extract fbx object information from ComplexVisual
     * @param {object} data - complexVisual to get geometry info from
     */
    _extractModelsAndMaterials(data: object): void;
    /**
     * Reworking indices buffer, see https://banexdevblog.wordpress.com/2014/06/23/a-quick-tutorial-about-the-fbx-ascii-format/
     * basically, every triangle in Miew has been represented hat way (e.g.) : 0,1,7, but we must (for FBX) rework that
     * into: 0,1,-8.
     * @param {array} indices - belongs to [0, maxVertIndex]
     */
    _reworkIndices(indices: any[]): void;
    /**
     * Combine geometry from several models having the same material into one Model and finally prepare indices
     * @returns {array} models, combined by material id
     */
    _flattenModels(): any[];
    /**
     * Check ability to export the kind of mesh.
     * @param {object} mesh - given mesh to check
     * @returns {boolean} result of check
     */
    checkExportAbility(mesh: object): boolean;
    /**
     * Save geometry info from common mesh, like Surface or Cartoon
     */
    _collectGeoInfo(mesh: any): void;
    /**
     * Collect instanced spheres geometry and materials.
     * @param {object} mesh - mesh with instanced spheres info
     */
    _collectSpheresInfo(mesh: object): void;
    /**
     * Getting all instanced cylinders from given mesh.
     * Divide cylinder (add additional vertexes) for prettiness therefore algorithm is a bit complicated
     * @param {object} mesh - given mesh with instanced cylinders
     */
    _collectCylindersInfo(mesh: object): void;
    /**
     * Adding model to pool of models or extend existing ones
     * @param {object} model - model to add
     * @param {object} material - material to add
     */
    _addToPool(model: object, material: object): void;
    /**
     * Checking if given material already was registered in materials pool (no need to create new one)
     * @param {object} material - given material
     * @returns {number} number of model-material pair
     */
    _checkExistingMaterial(material: object): number;
    _gatherCylindersColoringInfo(geo: any): {
        is2Colored: any[];
        needToSplit: number;
        addPerCylinder: any;
    };
    /**
     * Collect instanced models and materials.
     * @param {object} mesh - given mesh with instanced something (spheres or cylinders)
     */
    _collectInstancedGeoInfo(mesh: object): void;
    /**
     * Collect Material info from given mesh.
     * @param {object} mesh - given mesh with material info
     * @returns {object} material
     */
    _collectMaterialInfo(mesh: object): object;
    _getCylinderInstanceMatrix(geo: any, instIdx: any, matrix: any): void;
    _getSphereInstanceMatrix(geo: any, instIdx: any, matrix: any): void;
}
