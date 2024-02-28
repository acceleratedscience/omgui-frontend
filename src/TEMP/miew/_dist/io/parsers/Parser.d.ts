export default class Parser {
    constructor(data: any, options: any);
    _data: any;
    _options: any;
    _abort: boolean;
    parseSync(): void;
    parse(): Promise<any>;
    getModel(): any;
    abort(): void;
}
