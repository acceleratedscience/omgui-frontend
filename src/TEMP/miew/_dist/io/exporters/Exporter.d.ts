export default class Exporter {
    constructor(source: any, options: any);
    _source: any;
    _options: any;
    _abort: boolean;
    exportSync(): void;
    export(): Promise<any>;
    abort(): void;
}
