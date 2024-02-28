export default FXAAMaterial;
declare class FXAAMaterial {
    constructor(params: any);
    copy(source: any): void;
    depth: any;
    setValues(values: any): void;
    defines: {
        BG_TRANSPARENT: number;
    } | undefined;
    bgTransparent: boolean;
}
