declare class XHRLoader extends Loader {
    static canProbablyLoad(source: any): boolean;
    static extractName(source: any): any;
    _binary: boolean;
}
declare namespace XHRLoader {
    const types: string[];
}
export default XHRLoader;
import Loader from "./Loader";
