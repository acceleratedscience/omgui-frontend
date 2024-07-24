declare class FileLoader extends Loader {
    static canProbablyLoad(source: any): boolean;
    static extractName(source: any): any;
    _binary: boolean;
}
declare namespace FileLoader {
    const types: string[];
}
export default FileLoader;
import Loader from "./Loader";
