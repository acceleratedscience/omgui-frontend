export default VolumeBounds;
declare class VolumeBounds {
    static _projectionTable: {
        XY: (string | number)[];
        XZ: (string | number)[];
        YZ: (string | number)[];
    };
    constructor(bBox: any, volInfo: any);
    _lines: any;
    _getBaseVertices(delta: any, obtuseAngle: any): any[];
    getMesh(): any;
}
