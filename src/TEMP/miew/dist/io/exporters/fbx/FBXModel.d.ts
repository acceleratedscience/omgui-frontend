export default class FBXModel {
    positions: Float32Array | null;
    normals: Float32Array | null;
    colors: Float32Array | null;
    indices: Int32Array | null;
    lastPos: number;
    lastNorm: number;
    lastCol: number;
    lastIdx: number;
    init(vertsCount: any, indsCount: any): void;
    setPositions(array: any, start: any, count: any, stride: any): void;
    setTransformedPositions(array: any, start: any, count: any, stride: any, matrix: any): void;
    setNormals(array: any, start: any, count: any, stride: any): void;
    setTransformedNormals(array: any, start: any, count: any, stride: any, matrix: any): void;
    setColors(array: any, start: any, count: any, stride: any): void;
    setIndices(array: any, start: any, count: any): void;
    setShiftedIndices(array: any, count: any, shift: any): void;
    getVerticesNumber(): number;
    addInstance(matrix: any, geo: any): void;
}
