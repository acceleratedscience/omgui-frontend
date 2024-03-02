export default Component;
/**
 * This class represents connected component as a part of a complex.
 * WARNING! The whole component entity is build under the assumption that residues
 * are placed in the chains and complex in ascending order of indices
 *
 * @param {Complex} complex - Molecular complex this chain belongs to.
 *
 * @exports Component
 * @constructor
 */
declare class Component {
    constructor(complex: any);
    _complex: any;
    _index: number;
    _residueIndices: any[];
    _cycles: any[];
    _subDivs: any[];
    _residueCount: number;
    getResidues(): any;
    getResidueCount(): number;
    forEachResidue(process: any): void;
    setSubDivs(subDivs: any): void;
    getComplex(): any;
    forEachBond(process: any): void;
    update(): void;
    forEachAtom(process: any): void;
    addCycle(cycle: any): void;
    forEachCycle(process: any): void;
    markResidues(): void;
    _forEachSubChain(mask: any, process: any): void;
    getMaskedSequences(mask: any): any[];
    getMaskedSubdivSequences(mask: any): any[];
}
