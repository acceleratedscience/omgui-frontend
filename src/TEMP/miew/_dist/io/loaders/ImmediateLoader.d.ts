declare class ImmediateLoader extends Loader {
    static canProbablyLoad(_source: any): boolean;
}
declare namespace ImmediateLoader {
    const types: string[];
}
export default ImmediateLoader;
import Loader from "./Loader";
