export default CCP4Parser;
declare class CCP4Parser extends Parser {
    static canProbablyParse(_data: any): boolean;
    model: Ccp4Model;
}
declare namespace CCP4Parser {
    const formats: string[];
    const extensions: string[];
    const binary: boolean;
}
import Parser from "./Parser";
declare class Ccp4Model extends VolumeModel {
    _data: Float32Array | undefined;
}
import VolumeModel from "./VolumeModel";
