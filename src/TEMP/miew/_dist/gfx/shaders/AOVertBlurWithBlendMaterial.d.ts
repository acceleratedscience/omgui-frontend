export default AOVertBlurWithBlendMaterial;
declare class AOVertBlurWithBlendMaterial {
    constructor(params: any);
    setValues(values: any): void;
    defines: {
        USE_FOG: number;
        FOG_TRANSPARENT: number;
    } | undefined;
    useFog: boolean;
    fogTransparent: boolean;
}
