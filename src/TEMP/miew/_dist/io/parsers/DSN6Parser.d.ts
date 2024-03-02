export default DSN6Parser;
declare class DSN6Parser extends Parser {
    static canParse(data: any, options: any): any;
    static canProbablyParse(_data: any): boolean;
    model: DSN6Model;
}
declare namespace DSN6Parser {
    const formats: string[];
    const extensions: string[];
    const binary: boolean;
}
import Parser from "./Parser";
declare class DSN6Model extends VolumeModel {
    _pointCalculate(xyzData: any, byteBuffer: any, z: any, y: any, x: any, pos: any, i: any): boolean;
    _blockCalculate(xyzData: any, byteBuffer: any, zBlock: any, yBlock: any, xBlock: any, pos: any): void;
    _calculateInfoParams(xyzData: any): void;
}
import VolumeModel from "./VolumeModel";
