export default Colorer;
/**
 * Create new colorer.
 *
 * @param {object=} opts - Options to override defaults with.
 *
 *   These options are copied locally and not kept by reference, so the created instance will not reflect further
 *   changes to the `opts` object. However, changes in defaults **will** affect the colorer after its creation.
 *
 * @exports Colorer
 * @this Colorer
 * @abstract
 * @constructor
 * @classdesc Basic class for all available coloring algorithms used for building and displaying molecule geometry.
 */
declare class Colorer {
    constructor(opts: any);
    /**
     * Colorer options inherited (prototyped) from defaults.
     * @type {object}
     */
    opts: object;
    /**
     * Palette in use.
     * @type {Palette}
     */
    palette: Palette;
    /**
     * Get Colorer identification, probably with options.
     * @returns {string|Array} Colorer identifier string ({@link Colorer#id}) or two-element array containing both colorer
     *   identifier and options ({@link Colorer#opts}).
     * Options are returned if they were changed during or after colorer creation.
     */
    identify(): string | any[];
    /**
     * Colorer identifier.
     * @type {string}
     */
    id: string;
}
