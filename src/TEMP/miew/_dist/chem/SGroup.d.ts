export default SGroup;
/**
 * Atom measurements.
 *
 * @param {string} id              - SGroup id
 * @param {string} name            - Name of the group
 * @param {Vector3} position - Registered coordinates
 * @param {array} atoms            - Atoms group consists of
 * @param {object} saveNode        - XML node from file for saving
 *
 * @exports SGroup
 * @constructor
 */
declare class SGroup {
    constructor(id: any, name: any, position: any, atoms: any, saveNode: any);
    _id: any;
    _name: any;
    _position: any;
    _atoms: any;
    _charge: number;
    _repeat: number;
    _center: any;
    xmlNodeRef: any;
    /**
     * Get atom full name.
     * @returns {string} Atom full name.
     */
    getName(): string;
    getPosition(): any;
    getCentralPoint(): any;
    _rebuildSGroupOnAtomChange(): void;
}
