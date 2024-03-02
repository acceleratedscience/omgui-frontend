export namespace valueType {
    const singular: number;
    const vector: number;
    const array: number;
    const buffer: number;
}
export default VolumeModel;
declare class VolumeModel {
    _xyz2crs: any[];
    _origin: any;
    _header: {};
    _boxSize: any;
    _boxStart: any;
    _typedCheck(): void;
    _buff: any;
    _fillHeader(headerFormat: any, arrays: any): void;
    _parseVector(vector: any, arr: any, pos: any): void;
    _parseArray(vector: any, arr: any, pos: any): void;
    _parseHeader(_buffer: any): void;
    _setAxisIndices(): void;
    _setOrigins(): void;
    _getAxis(): any[];
    _getXYZdim(): any[];
    _getVolumeInfo(): Partial<{}>;
    _setBoxParams(xaxis: any, yaxis: any, zaxis: any): void;
    _getXYZbox(): any;
    _toXYZData(): void;
    parse(data: any): Volume;
}
import Volume from "../../chem/Volume";
