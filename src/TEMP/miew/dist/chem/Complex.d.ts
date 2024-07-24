export default Complex;
/**
 * The entire complex of the molecules under study.
 *
 * @exports Complex
 * @constructor
 */
declare class Complex {
    _chains: any[];
    _components: any[];
    _helices: any[];
    _sheets: any[];
    structures: any[];
    _residueTypes: any;
    _atoms: any[];
    _residues: any[];
    _bonds: any[];
    _sgroups: any[];
    _molecules: any[];
    _maskNeedsUpdate: boolean;
    metadata: {};
    symmetry: any[];
    units: BiologicalUnit[];
    _currentUnit: number;
    addAtom(atom: any): number;
    addSheet(sheet: any): number;
    addHelix(helix: any): number;
    getAtoms(): any[];
    getBonds(): any[];
    getAtomCount(): number;
    addResidue(residue: any): number;
    updateToFrame(frameData: any): void;
    addResidueType(resName: any): ResidueType;
    getResidueCount(): number;
    getResidues(): any[];
    getSGroupCount(): number;
    getSGroups(): any[];
    getAtomByFullname(fullName: any): null;
    /**
     * Create a new chain.
     *
     * @param {string} name - Chain name.
     * @returns {Chain} - Newly created chain.
     */
    addChain(name: string): Chain;
    getChain(name: any): any;
    getChainCount(): number;
    getMolecules(): any[];
    getMoleculeCount(): number;
    forEachAtom(process: any): void;
    forEachBond(process: any): void;
    forEachResidue(process: any): void;
    forEachChain(process: any): void;
    forEachMolecule(process: any): void;
    forEachSGroup(process: any): void;
    forEachComponent(process: any): void;
    forEachVisibleComponent(process: any): void;
    addBond(left: any, right: any, order: any, type: any, fixed: any): Bond;
    getBondCount(): number;
    getResidueType(name: any): any;
    getUnifiedSerial(chain: any, serial: any, iCode: any): any;
    splitUnifiedSerial(uniSerial: any): {
        chain: number;
        serial: number;
        iCode: number;
    };
    _fillCmpEdit(): void;
    _fillCmpNoedit(): void;
    /**
     * Fill components information.
     * @param {boolean} enableEditing - Restructure Complex to enable per-component editing.
     */
    _fillComponents(enableEditing: boolean): void;
    getCurrentUnit(): number;
    getDefaultBoundaries(): {
        boundingBox: any;
        boundingSphere: any;
    };
    getBoundaries(): {
        boundingBox: any;
        boundingSphere: any;
    };
    getTransforms(): never[];
    getSelector(): any;
    resetCurrentUnit(): void;
    setCurrentUnit(newUnit: any): boolean;
    _computeBounds(): void;
    onAtomPositionChanged(): void;
    update(): void;
    _finalizeBonds(): void;
    /**
     * Finalizes complex's inner data(i.e. after parsing).
     * @param {objects} opts - Build bonds automatically.
     * @param {boolean} opts.needAutoBonding     - Build bonds automatically.
     * @param {boolean} opts.detectAromaticLoops - Find/mark aromatic loops.
     * @param {boolean} opts.enableEditing       - Restructure Complex to enable per-component editing.
     * @param {Array<Atom>} [opts.serialAtomMap] - Array of atoms ordered by their serials.
     */
    finalize(opts: objects): void;
    _finalizeMolecules(): void;
    updateStructuresMask(): void;
    countAtomsByMask(mask: any): number;
    getNumAtomsBySelector(selector: any): number;
    resetAtomMask(mask: any): void;
    markAtoms(selector: any, mask: any): number;
    markAtomsAdditionally(selector: any, mask: any): number;
    clearAtomBits(mask: any): void;
    getAtomNames(): string[] | undefined;
    _atomNames: string[] | undefined;
    getElements(): string[] | undefined;
    _elements: string[] | undefined;
    getResidueNames(): string[] | undefined;
    _residueNames: string[] | undefined;
    getChainNames(): string[] | undefined;
    _chainNames: string[] | undefined;
    getAltLocNames(): string[] | undefined;
    _altlocNames: string[] | undefined;
    getVoxelWorld(): VoxelWorld | null | undefined;
    _voxelWorld: VoxelWorld | null | undefined;
    /**
     * Simple function to make unified routine procedure without code duplication.
     * @param {Array} srcArray   - Source chemical structure array (will be part of resulting chemical structure array).
     * @param {Array} dstArray   - Resulting chemical structure array.
     * @param {number} param     - Parameter for processor.
     * @param {function} functor - Processor for every element in array.
     */
    addElement(srcArray: any[], dstArray: any[], param: number, functor: Function): void;
    joinComplexes(complexes: any): void;
    /**
     * Replace secondary structure with calculated one.
     *
     * DSSP algorithm implementation is used.
     *
     * Kabsch W, Sander C. 1983. Dictionary of protein secondary structure: pattern recognition of hydrogen-bonded and
     * geometrical features. Biopolymers. 22(12):2577-2637. doi:10.1002/bip.360221211.
     */
    dssp(): void;
    id: string;
    name: string;
}
import BiologicalUnit from "./BiologicalUnit";
import ResidueType from "./ResidueType";
import Chain from "./Chain";
import Bond from "./Bond";
import VoxelWorld from "./VoxelWorld";
