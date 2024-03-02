export default Visual;
declare const Visual_base: typeof import("./gfx/RCGroup").default;
declare class Visual extends Visual_base {
    constructor(name: any, dataSource: any);
    name: any;
    _dataSource: any;
    release(): void;
    getDataSource(): any;
    getBoundaries(): {
        boundingBox: any;
        boundingSphere: any;
    };
}
