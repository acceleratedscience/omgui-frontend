export default class FBXResult {
    _resultArray: any[];
    _info: any;
    getResult(info: any): string;
    /**
     * Add FBXHeader info to output file.
     * Some fields are really confusing, but it seems that all listed fields are very informative
     */
    _writeHeader(): string;
    /**
     * Add Definitions info to output file.
     * Not exactly sure if this section is template section (as it is in 7.4+) or it should every time be like this
     */
    _writeDefinitions(): string;
    /**
     * Adding gathered information about Models to resulting string.
     * Reminder - there may be more then 1 model in scene, but we must place materials after ALL models.
     * @returns {string} string containing all models (vertices, indices, colors, normals etc)
     */
    _models(): string;
    /**
     * Add Material info to result
     */
    _materials(): string;
    /**
     * Add Objects info to output file.
     */
    _writeObjects(): string;
    /**
     * Add Relations info to output file.
     */
    _writeRelations(): string;
    /**
     * Add Connections info to output file.
     */
    _writeConnections(): string;
    /**
     * Write float array to string with limited precision
     * @param {Float32Array} array - array to be fixed
     * @returns {String} String with fixed floats
     */
    _floatArrayToString(array: Float32Array): string;
    /**
     * Adding color layer to resulting file
     * @param {Float32Array} colorArray attribute
     * @param {number} vertCount - number of vertices in the model
     * @returns {string} color layer info
     */
    _colorLayer(colorArray: Float32Array, vertCount: number): string;
    /**
     * Adding normal layer to resulting file
     * @param {Float32Array} normalArray attribute
     * @returns {string} normal layer info
     */
    _normalLayer(normalArray: Float32Array): string;
    /**
     * Adding vertices and indices to resulting string
     * @return {string} resulting string in FBX notation
     */
    _verticesIndices(positions: any, indices: any): string;
    /**
     * Forming material properties block.
     * @param {Object} material - given material of model
     * @returns {String} material properties string
     */
    _materialProperties(material: any): string;
}
