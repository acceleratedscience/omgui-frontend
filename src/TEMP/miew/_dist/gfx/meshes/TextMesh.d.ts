export default TextMesh;
declare class TextMesh {
    constructor(geometry: any, _material: any);
    geometry: any;
    initialized: boolean;
    init(): void;
    update(): void;
}
