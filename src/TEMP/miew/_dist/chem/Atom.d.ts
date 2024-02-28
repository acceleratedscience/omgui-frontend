export default Atom;
/**
 * Atom measurements.
 *
 * @param {Residue} residue    - (required) Residue containing the atom
 * @param {string} name        - (required) Name, unique in the residue
 * @param {Element} type       - (required) Chemical element reference
 * @param {Vector3} position - Registered coordinates
 *
 * @param {number} role        - Role of atom inside monomer: Lead and wing are particularity interesting
 * @param {boolean} het        - Non-standard residue indicator
 *
 * @param {number} serial      - Serial number, unique in the model
 * @param {string} location    - Alternative location indicator (usually space or A-Z)
 * @param {number} occupancy   - Occupancy percentage, from 0 to 1
 * @param {number} temperature - Temperature
 * @param {number} charge      - Charge
 *
 * @exports Atom
 * @constructor
 */
declare class Atom {
    /**
     * Enumeration of atom flag values.
     *
     * @enum {number}
     * @readonly
     */
    static readonly Flags: {
        CARBON: number;
        HYDROGEN: number;
        /** Non-polar hydrogen (it is also a HYDROGEN) */
        NONPOLARH: number;
    };
    constructor(residue: any, name: any, type: any, position: any, role: any, het: any, serial: any, location: any, occupancy: any, temperature: any, charge: any);
    index: number;
    residue: any;
    name: any;
    element: any;
    position: any;
    role: any;
    mask: number;
    het: any;
    serial: any;
    location: any;
    occupancy: any;
    temperature: any;
    charge: any;
    hydrogenCount: number;
    radicalCount: number;
    valence: number;
    bonds: any[];
    flags: number;
    isHet(): any;
    isHydrogen(): boolean;
    getVisualName(): any;
    forEachBond(process: any): void;
    getFullName(): string;
}
