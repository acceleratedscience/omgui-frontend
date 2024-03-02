export default Mode;
/**
 * Create new mode.
 *
 * @param {object=} opts - Options to override defaults with.
 *
 *   These options are copied locally and not kept by reference, so the created instance will not reflect further
 *   changes to the `opts` object. However, changes in defaults **will** affect the mode after its creation.
 *
 * @exports Mode
 * @this Mode
 * @abstract
 * @constructor
 * @classdesc Basic class for all available modes used for building and displaying molecule geometry.
 */
declare class Mode {
    constructor(opts: any);
    /**
     * Mode options inherited (prototyped) from defaults.
     * @type {object}
     */
    opts: object;
    /**
     * Get mode identification, probably with options.
     * @returns {string|Array} Mode identifier string ({@link Mode#id}) or two-element array containing both mode
     *   identifier and options ({@link Mode#opts}).
     * Options are returned if they were changed during or after the mode creation.
     */
    identify(): string | any[];
    buildGeometry(complex: any, colorer: any, mask: any, material: any): import("../RCGroup").default;
    /**
     * Mode identifier.
     * @type {string}
     */
    id: string;
    /**
     * Mode geo groups.
     * @type {Array}
     */
    depGroups: any[];
}
