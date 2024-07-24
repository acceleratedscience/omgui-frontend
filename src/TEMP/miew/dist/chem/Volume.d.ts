export default Volume;
/**
 * Volume constructor
 *
 * @param {Object} type - Float32Array, Int8Array, etc...
 * @param {Object|Array} dimensions - number of data points on each axis (x, y, z)
 * @param {Box3} box - bounding box defining data place in metric space,
 *                     it's corners correspond to extreme data points
 * @param {Number} vecSize - dimension of the field data point (1 = scalar, 3 = 3D vector)
 * @param {Object} data - typed array of the same type as specified by the 1st parameter,
 *                        layout: point by point along X,
 *                                row by row along Y,
 *                                plane by plane along Z
 * @param {Number} volumeInfo - volume info values to define threshold to filter the noise
 */
declare class Volume {
    constructor(type: any, dimensions: any, box: any, vecSize: any, data: any, volumeInfo: any);
    _box: any;
    _dimVec: 1 | 2 | 3;
    _volumeInfo: any;
    _dimX: number;
    _dimY: number;
    _dimZ: number;
    _rowElements: number;
    _planeElements: number;
    _totalElements: number;
    _data: any;
    getValue(x: any, y: any, z: any): any;
    setValue(x: any, y: any, z: any, val: any): void;
    addValue(x: any, y: any, z: any, val: any): void;
    getDimensions(): number[];
    getBox(): any;
    getVolumeInfo(): any;
    getCellSize(): any;
    computeGradient(): Volume | null;
    normalize(): void;
    getTiledTextureStride(): number[];
    buildTiledTexture(): any;
    getData(): any;
    getDirectIdx(x: any, y: any, z: any): number;
    getStrideX(): 1 | 2 | 3;
    getStrideY(): number;
    getStrideZ(): number;
    id: string;
}
