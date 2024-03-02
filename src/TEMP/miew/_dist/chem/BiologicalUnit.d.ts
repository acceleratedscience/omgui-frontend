export default BiologicalUnit;
/**
 * Basic biological unit class.
 *
 * @exports BiologicalUnit
 * @constructor
 */
declare class BiologicalUnit {
    constructor(complex: any);
    _complex: any;
    _selector: any;
    _boundaries: {
        boundingBox: any;
        boundingSphere: any;
    };
    computeBoundaries(): void;
    getTransforms(): never[];
    getSelector(): any;
    getBoundaries(): {
        boundingBox: any;
        boundingSphere: any;
    };
    finalize(): void;
}
