export default class Loader extends EventDispatcher {
    static extractName(_source: any): undefined;
    constructor(source: any, options: any);
    _source: any;
    _options: any;
    _abort: boolean;
    _agent: any;
    load(): Promise<never>;
    abort(): void;
}
import EventDispatcher from "../../utils/EventDispatcher";
