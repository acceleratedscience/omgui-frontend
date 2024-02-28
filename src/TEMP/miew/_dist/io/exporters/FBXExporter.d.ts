declare class FBXExporter extends Exporter {
    _data: any;
    _version: any;
    _extractor: FBXInfoExtractor;
    _result: string | undefined;
}
declare namespace FBXExporter {
    export const formats: string[];
    export { ComplexVisual as SourceClass };
}
export default FBXExporter;
import Exporter from "./Exporter";
import FBXInfoExtractor from "./fbx/FBXInfoExtractor";
import ComplexVisual from "../../ComplexVisual";
