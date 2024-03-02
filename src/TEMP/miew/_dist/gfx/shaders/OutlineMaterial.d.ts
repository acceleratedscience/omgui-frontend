export default OutlineMaterial;
declare class OutlineMaterial {
    constructor(params: any);
    copy(source: any): void;
    depth: any;
    setValues(values: any): void;
    defines: {
        DEPTH_OUTLINE: number;
    } | undefined;
}
