export default SceneObject;
/**
 * Create new scene object.
 *
 * @param {array=} params - Object required params.
 * @param {object=} opts - Options to override defaults with.
 *
 *   These options are copied locally and not kept by reference, so the created instance will not reflect further
 *   changes to the `opts` object. However, changes in defaults **will** affect the colorer after its creation.
 *
 * @exports SceneObject
 * @this SceneObject
 * @abstract
 * @constructor
 * @classdesc Basic class for all scene objects that are not reps.
 */
declare class SceneObject {
    constructor(params: any, opts: any);
    /**
     * Object's options inherited (prototyped) from defaults.
     * @type {object}
     */
    params: object;
    opts: any;
    needsRebuild: boolean;
    _mesh: any;
    id: any;
    /**
     * Get object identification, probably with options.
     *  @returns {Object} field type contains type information, params - object's formal parameters,
     * opts - changed options
     * Options are returned if they were changed during or after object creation.
     */
    identify(): any;
    toString(): string;
    getGeometry(): any;
    destroy(): void;
    /**
     * Scene object identifier.
     * @type {string}
     */
    type: string;
}
