import EventDispatcher from './utils/EventDispatcher';
import './Miew.scss';
/**
 * Main 3D Molecular Viewer class.
 *
 * @param {object} opts - Viewer options.
 * @param {HTMLElement=} opts.container - DOM element that serves as a viewer container.
 * @param {object=} opts.settings - An object with properties to override default settings.
 * @param {string=} opts.settingsCookie='settings' - The name of the cookie to save current settings to.
 * @param {string=} opts.cookiePath='/' - The path option for cookies. Defaults to root.
 *
 * @exports Miew
 * @constructor
 */
export interface MiewOptions {
    container?: HTMLDivElement | null;
    settingsCookie?: string;
    cookiePath?: string;
    load?: string;
    settings?: {
        palette?: string;
        shadow?: object;
        ao?: boolean;
        aromatic?: boolean;
        autobuild?: boolean;
        autoRotation?: number;
        autoRotationAxisFixed?: boolean;
        axes?: boolean;
        colorers?: object;
        editing?: boolean;
        fbxprec?: number;
        fox?: boolean;
        fogFarFactor?: number;
        fogNearFactor?: number;
        fps?: boolean;
        fxaa?: boolean;
        interpolateViews?: boolean;
        maxfps?: number;
        modes?: object;
        outline?: boolean;
        pick?: string;
        picking?: boolean;
        singleUnit?: boolean;
        stereo?: string;
        suspendRender?: boolean;
        translationSpeed?: number;
        transparency?: string;
        zooming?: boolean;
        zSprite?: boolean;
    };
}
export declare class Miew extends EventDispatcher {
    constructor(opts: MiewOptions);
    getMaxRepresentationCount(): number;
    /**
     * Update Shadow Camera target position and frustum.
     * @private
     */
    _updateShadowCamera(): void;
    /**
     * Initialize the viewer.
     * @returns {boolean} true on success.
     * @throws Forwards exception raised during initialization.
     * @see Miew#term
     */
    init(): boolean;
    /**
     * Terminate the viewer completely.
     * @see Miew#init
     */
    term(): void;
    /**
     * Display message inside the viewer container, hiding WebGL canvas.
     * @param {string} msg - Message to show.
     * @private
     */
    _showMessage(msg: any): void;
    /**
     * Display WebGL canvas inside the viewer container, hiding any message shown.
     * @private
     */
    _showCanvas(): void;
    _requestAnimationFrame(callback: any): void;
    /**
     * Initialize WebGL and set 3D scene up.
     * @private
     */
    _initGfx(): void;
    /**
     * Setup event listeners.
     * @private
     */
    _initListeners(): void;
    /**
     * Try to add numbers to the base name to make it unique among visuals
     * @private
     */
    _makeUniqueVisualName(baseName: any): any;
    /**
     * Add visual to the viewer
     * @private
     */
    _addVisual(visual: any): any;
    /**
     * Remove visual from the viewer
     * @private
     */
    _removeVisual(visual: any): void;
    /**
     * Call specified function for each Visual
     * @private
     */
    _forEachVisual(callback: any): void;
    /**
     * Release (destroy) all visuals in the scene
     * @private
     */
    _releaseAllVisuals(): void;
    /**
     * Call specified function for each ComplexVisual
     * @private
     */
    _forEachComplexVisual(callback: any): void;
    /**
     * Returns ComplexVisual with specified name, or current (if not found), or any, or null
     * @private
     */
    _getComplexVisual(name: any): null;
    /**
     * Returns first found VolumeVisual (no more than one should be present actually)
     * @private
     */
    _getVolumeVisual(): null;
    /**
     * Returns ComplexVisual corresponding to specified complex
     * @private
     */
    _getVisualForComplex(complex: any): null;
    getVisuals(): string[];
    getComplexVisualsCount(): number;
    getCurrentVisual(): any;
    setCurrentVisual(name: any): void;
    /**
     * Run the viewer, start processing update/render frames periodically.
     * Has no effect if already running.
     * @see Miew#halt
     */
    run(): void;
    /**
     * Request the viewer to stop.
     * Will be processed during the next frame.
     * @see Miew#run
     */
    halt(): void;
    /**
     * Request the viewer to start / stop responsing
     * on hot keys.
     * @param enabled - start (true) or stop (false) response on hot keys.
     */
    enableHotKeys(enabled: any): void;
    /**
     * Callback which processes window resize.
     * @private
     */
    _onResize(): void;
    _resizeOffscreenBuffers(width: any, height: any, stereo: any): void;
    /**
     * Callback which processes update/render frames.
     * @private
     */
    _onTick(): void;
    _getBSphereRadius(): number;
    /**
     * Calculate bounding box that would include all visuals and being axis aligned in world defined by
     * transformation matrix: matrix
     * @param {Matrix4} matrix - transformation matrix.
     * @param {object}  OBB           - calculating bounding box.
     * @param {Vector3} OBB.center    - OBB center.
     * @param {Vector3} OBB.halfSize  - half magnitude of OBB sizes.
     */
    getOBB(matrix: any, OBB: any): void;
    _updateFog(): void;
    _onUpdate(): void;
    _onRender(): void;
    _renderFrame(stereo: any): void;
    _onBgColorChanged(): void;
    _onFogColorChanged(): void;
    _setUberMaterialValues(values: any): void;
    _enableMRT(on: any, renderBuffer: any, textureBuffer: any): void;
    _renderScene(camera: any, distortion: any, target: any): void;
    _performDistortion(srcBuffer: any, targetBuffer: any, mesh: any): void;
    _renderOutline(camera: any, srcDepthBuffer: any, srcColorBuffer: any, targetBuffer: any): void;
    _renderShadowMap(): void;
    /**
     * Check if there is selection which must be rendered or not.
     * @private
     * @returns {boolean} true on existing selection to render
     */
    _hasSelectionToRender(): boolean;
    _renderSelection(camera: any, srcBuffer: any, targetBuffer: any): void;
    _checkVolumeRenderingSupport(renderTarget: any): boolean;
    _renderVolume(volumeVisual: any, camera: any, dstBuf: any, tmpBuf1: any, tmpBuf2: any, tmpBuf3: any): void;
    _renderWithPrepassTransparency(camera: any, targetBuffer: any): void;
    _performFXAA(srcBuffer: any, targetBuffer: any): void;
    _performAO(srcColorBuffer: any, normalBuffer: any, srcDepthTexture: any, targetBuffer: any, tempBuffer: any, tempBuffer1: any): void;
    /**
     * Reset the viewer, unload molecules.
     * @param {boolean=} keepReps - Keep representations while resetting viewer state.
     */
    reset(): void;
    _resetScene(): void;
    resetView(): void;
    _export(format: any): any;
    /**
     * Load molecule asynchronously.
     * @param {string|File} source - Molecule source to load (e.g. PDB ID, URL or File object).
     * @param {object=} opts - Options.
     * @param {string=} opts.sourceType - Data source type (e.g. 'url', 'file').
     * @param {string=} opts.fileType - Data contents type (e.g. 'pdb', 'cml').
     * @param {string=} opts.mdFile - .nc file path.
     * @param {boolean=} opts.keepRepsInfo - prevent reset of object and reps information.
     * @returns {Promise} name of the visual that was added to the viewer
     */
    load(source: any, opts: any): Promise<any>;
    /**
     * Unload molecule (delete corresponding visual).
     * @param {string=} name - name of the visual
     */
    unload(name: any): void;
    /**
     * Start new animation. Now is broken.
     * @param fileData - new data to animate
     * @private
     * @deprecated until animation system refactoring.
     */
    _startAnimation(fileData: any): void;
    /**
     * Pause current animation. Now is broken.
     * @private
     * @deprecated until animation system refactoring.
     */
    _pauseAnimation(): void;
    /**
     * Continue current animation after pausing. Now is broken.
     * @private
     * @deprecated until animation system refactoring.
     */
    _continueAnimation(): void;
    /**
     * Stop current animation. Now is broken.
     * @private
     * @deprecated until animation system refactoring.
     */
    _stopAnimation(): void;
    /**
     * Invoked upon successful loading of some data source
     * @param {DataSource} dataSource - Data source for visualization (molecular complex or other)
     * @param {object} opts - Options.
     * @private
     */
    _onLoad(dataSource: any, opts: any): null;
    resetEd(): void;
    loadEd(source: any): any;
    _onLoadEd(dataSource: any): any;
    _needRebuild(): boolean;
    _rebuildObjects(): void;
    changeUnit(unitIdx: any, name: any): string;
    /**
     * Start to rebuild geometry asynchronously.
     */
    rebuild(): void;
    /** Mark all representations for rebuilding */
    rebuildAll(): void;
    _refreshTitle(appendix: any): void;
    setNeedRender(): void;
    _extractRepresentation(): void;
    /**
     * Change current representation list.
     * @param {array} reps - Representation list.
     */
    _setReps(reps: any): void;
    /**
     * Apply existing preset to current scene.
     * @param preset
     */
    applyPreset(preset: any): void;
    /**
     * Reset current representation list to initial values.
     * @param {string} [preset] - The source preset in case of uninitialized representation list.
     */
    resetReps(preset: any): void;
    /**
     * Get number of representations created so far.
     * @returns {number} Number of reps.
     */
    repCount(name: any): any;
    /**
     * Get or set the current representation index.
     * @param {number=} index - Zero-based index, up to {@link Miew#repCount()}. Defaults to the current one.
     * @param {string=} [name] - Complex name. Defaults to the current one.
     * @returns {number} The current index.
     */
    repCurrent(index: any, name: any): any;
    /**
     * Get or set representation by index.
     * @param {number=} index - Zero-based index, up to {@link Miew#repCount}(). Defaults to the current one.
     * @param {object=} rep - Optional representation description.
     * @param {string=} rep.selector - Selector string.
     * @param {string=} rep.mode - Mode id.
     * @param {string=} rep.colorer - Colorer id.
     * @param {string=} rep.material - Material id.
     * @returns {?object} Representation description.
     */
    rep(index: any, rep: any): any;
    /**
     * Get representation (not just description) by index.
     * @param {number=} index - Zero-based index, up to {@link Miew#repCount}(). Defaults to the current one.
     * @returns {?object} Representation.
     */
    repGet(index: any, name: any): any;
    /**
     * Add new representation.
     * @param {object=} rep - Representation description.
     * @returns {number} Index of the new representation.
     */
    repAdd(rep: any, name: any): any;
    /**
     * Remove representation.
     * @param {number=} index - Zero-based representation index.
     */
    repRemove(index: any, name: any): void;
    /**
     * Hide representation.
     * @param {number} index - Zero-based representation index.
     * @param {boolean=} hide - Specify false to make rep visible, true to hide (by default).
     */
    repHide(index: any, hide: any, name: any): any;
    _setEditMode(mode: any): void;
    _enterComponentEditMode(): void;
    _applyComponentEdit(): void;
    _discardComponentEdit(): void;
    _enterFragmentEditMode(): void;
    _applyFragmentEdit(): void;
    _discardFragmentEdit(): void;
    _onPick(event: any): void;
    _onKeyDown(event: any): void;
    _onKeyUp(event: any): void;
    _updateInfoPanel(): void;
    _getAltObj(): {
        objects: never[];
        pivot: any;
    };
    resetPivot(): void;
    setPivotResidue(residue: any): void;
    setPivotAtom(atom: any): void;
    getSelectionCenter(center: any, includesAtom: any, selector: any): boolean;
    setPivotSubset(selector: any): void;
    /**
     * Makes a screenshot.
     * @param {number} [width] - Width of an image. Defaults to the canvas width.
     * @param {number} [height] - Height of an image. Defaults to the width (square) or canvas height,
     *        if width is omitted too.
     * @returns {string} Data URL representing the image contents.
     */
    screenshot(width: any, height: any): any;
    /**
     * Makes screenshot and initiates a download.
     * @param {string} [filename] - Name of a file. Default to a 'screenshot-XXXXX.png', where XXXXX is a current
     *        date/time in seconds.
     * @param {number} [width] - Width of an image. Defaults to the canvas width.
     * @param {number} [height] - Height of an image. Defaults to the width (square) or canvas height,
     *        if width is omitted too.
     */
    screenshotSave(filename: any, width: any, height: any): void;
    save(opts: any): void;
    _tweakResolution(): void;
    _autoChangeResolution(resolution: any): void;
    /**
     * Save current settings to cookies.
     */
    saveSettings(): void;
    /**
     * Load settings from cookies.
     */
    restoreSettings(): void;
    /**
     * Reset current settings to the defaults.
     */
    resetSettings(): void;
    setOptions(opts: any): void;
    info(name: any): {
        id?: undefined;
        title?: undefined;
        atoms?: undefined;
        bonds?: undefined;
        residues?: undefined;
        chains?: undefined;
    } | {
        id: any;
        title: any;
        atoms: any;
        bonds: any;
        residues: any;
        chains: any;
    };
    addObject(objData: any, bThrow: any): void;
    _addSceneObject(sceneObject: any): void;
    _updateObjsToFrame(frameData: any): void;
    _resetObjects(): void;
    removeObject(index: any): void;
    /**
     * Get a string with a URL to reproduce the current scene.
     *
     * @param {boolean} [opts.compact=true] - set this flag to false if you want to include full
     * preset information regardless of the differences with settings
     * @param {boolean} [opts.settings=false] - when this flag is true, changes in settings are included
     * @param {boolean} [opts.view=false] - when this flag is true, a view information is included
     * @returns {string} URL
     */
    getURL(opts: any): string;
    /**
     * Get a string with a script to reproduce the current scene.
     *
     * @param {boolean} [opts.compact=true] - set this flag to false if you want to include full
     * preset information regardless of the differences with settings
     * @param {boolean} [opts.settings=true] - when this flag is true, changes in settings are included
     * @param {boolean} [opts.view=true] - when this flag is true, a view information is included
     * @returns {string} script
     */
    getScript(opts: any): string;
    _compareReps(complexVisual: any, compareWithDefaults: any): {};
    getState(opts: any): {};
    /**
     * Get parameter value.
     * @param {string} param - Parameter name or path (e.g. 'modes.BS.atom').
     * @param {*=} value - Default value.
     * @returns {*} Parameter value.
     */
    get(param: any, value: any): any;
    _clipPlaneUpdateValue(radius: any): void;
    _fogFarUpdateValue(): void;
    _updateShadowmapMeshes(process: any): void;
    _updateMaterials(values: any, needTraverse?: boolean, process?: undefined): void;
    _fogAlphaChanged(): void;
    _embedWebXR(): void;
    _initOnSettingsChanged(): void;
    /**
     * Set parameter value.
     * @param {string|object} params - Parameter name or path (e.g. 'modes.BS.atom') or even settings object.
     * @param {*=} value - Value.
     */
    set(params: any, value: any): void;
    /**
     * Select atoms with selection string.
     * @param {string} expression - string expression of selection
     * @param {boolean=} append - true to append selection atoms to current selection, false to rewrite selection
     */
    select(expression: any, append: any): void;
    /**
     * Get or set view info packed into string.
     *
     * **Note:** view is stored for *left-handed* cs, euler angles are stored in radians and *ZXY-order*,
     *
     * @param {string=} expression - Optional string encoded the view
     */
    view(expression: any): any;
    _updateView(): void;
    /**
     * Translate object by vector
     * @param {number} x - translation value (Ang) along model's X axis
     * @param {number} y - translation value (Ang) along model's Y axis
     * @param {number} z - translation value (Ang) along model's Z axis
     */
    translate(x: any, y: any, z: any): void;
    /**
     * Rotate object by Euler angles
     * @param {number} x - rotation angle around X axis in radians
     * @param {number} y - rotation angle around Y axis in radians
     * @param {number} z - rotation angle around Z axis in radians
     */
    rotate(x: any, y: any, z: any): void;
    /**
     * Scale object by factor
     * @param {number} factor - scale multiplier, should greater than zero
     */
    scale(factor: any): void;
    /**
     * Center view on selection
     * @param {empty | subset | string} selector - defines part of molecule which must be centered (
     * empty - center on current selection;
     * subset - center on picked atom/residue/molecule;
     * string - center on atoms correspond to selection string)
     */
    center(selector: any): void;
    /**
     * Build selector that contains all atoms within given distance from group of atoms
     * @param {Selector} selector - selector describing source group of atoms
     * @param {number} radius - distance
     * @returns {Selector} selector describing result group of atoms
     */
    within(selector: any, radius: any): any;
    /**
     * Get atom position in 2D canvas coords
     * @param {string} fullAtomName - full atom name, like A.38.CG
     * @returns {Object} {x, y} or false if atom not found
     */
    projected(fullAtomName: any, complexName: any): false | {
        x: number;
        y: number;
    };
    /**
     * Replace secondary structure with calculated one.
     *
     * DSSP algorithm implementation is used.
     *
     * Kabsch W, Sander C. 1983. Dictionary of protein secondary structure: pattern recognition of hydrogen-bonded and
     * geometrical features. Biopolymers. 22(12):2577-2637. doi:10.1002/bip.360221211.
     *
     * @param {string=} complexName - complex name
     */
    dssp(complexName: any): void;
    exportCML(): string | null;
    /**
     * Reproduce the RCSB PDB Molecule of the Month style by David S. Goodsell
     *
     * @see http://pdb101.rcsb.org/motm/motm-about
     */
    motm(): void;
}
