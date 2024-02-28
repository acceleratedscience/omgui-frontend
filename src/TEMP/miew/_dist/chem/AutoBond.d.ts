export default AutoBond;
/**
 * Bond between atoms.
 *
 * @param {Complex} complex molecular complex

 * @exports AutoBond
 * @constructor
 */
declare class AutoBond {
    constructor(complex: any);
    _complex: any;
    _maxRad: number;
    _vBoxMin: any;
    _vBoxMax: any;
    _pairCollection: AtomPairs | null;
    /**
     * Add existing pairs of connectors (from pdb file after its reading)
     * @returns {number} 0
     */
    _addExistingPairs(): number;
    _findPairs(): void;
    _addPairs(): void;
    _addPair(atomA: any, atomB: any): void;
    build(): void;
    _buildInner(): void;
    _calcBoundingBox(): void;
    destroy(): void;
}
import AtomPairs from "./AtomPairs";
