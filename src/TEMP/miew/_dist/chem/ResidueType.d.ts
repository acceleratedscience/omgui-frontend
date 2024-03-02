export default ResidueType;
/**
 * Residue type.
 *
 * Predefined acid or created with HET, HETNAM, etc.
 *
 * @param {string} name            - Short name, either standard (ALA, MET, etc.) or non-standard one.
 * @param {string} fullName        - Full residue name.
 * @param {string} letterCode      - 1-letter symbol.
 *
 * @exports ResidueType
 * @constructor
 */
declare class ResidueType {
    static StandardTypes: {
        ALA: ResidueType;
        ARG: ResidueType;
        ASN: ResidueType;
        ASP: ResidueType;
        CYS: ResidueType;
        GLN: ResidueType;
        GLU: ResidueType;
        GLY: ResidueType;
        HIS: ResidueType;
        ILE: ResidueType;
        LEU: ResidueType;
        LYS: ResidueType;
        MET: ResidueType;
        PHE: ResidueType;
        PRO: ResidueType;
        PYL: ResidueType;
        SEC: ResidueType;
        SER: ResidueType;
        THR: ResidueType;
        TRP: ResidueType;
        TYR: ResidueType;
        VAL: ResidueType;
        A: ResidueType;
        C: ResidueType;
        G: ResidueType;
        I: ResidueType;
        T: ResidueType;
        U: ResidueType;
        DA: ResidueType;
        DC: ResidueType;
        DG: ResidueType;
        DI: ResidueType;
        DT: ResidueType;
        DU: ResidueType;
        '+A': ResidueType;
        '+C': ResidueType;
        '+G': ResidueType;
        '+I': ResidueType;
        '+T': ResidueType;
        '+U': ResidueType;
        WAT: ResidueType;
        H2O: ResidueType;
        HOH: ResidueType;
        DOD: ResidueType;
        UNK: ResidueType;
        UNL: ResidueType;
    };
    /**
     * Enumeration of residue flag values.
     *
     * @enum {number}
     * @readonly
     */
    static readonly Flags: {
        /** Amino acid residue */
        PROTEIN: number;
        /** Basic amino acid residue */
        BASIC: number;
        /** Acidic amino acid residue */
        ACIDIC: number;
        /** Polar uncharged side chain amino acid residue */
        POLAR: number;
        /** Non-polar hydrophobic side chain amino acid residue */
        NONPOLAR: number;
        /** Aromatic amino acid residue */
        AROMATIC: number;
        /** Nucleic residue */
        NUCLEIC: number;
        /** Purine nucleic residue */
        PURINE: number;
        /** Pyrimidine nucleic residue */
        PYRIMIDINE: number;
        /** DNA */
        DNA: number;
        /** RNA */
        RNA: number;
        /** Water */
        WATER: number;
    };
    constructor(name: any, fullName: any, letterCode: any);
    _name: any;
    _fullName: any;
    letterCode: any;
    flags: number;
    getName(): any;
}
