export default class PDBResult {
    _resultArray: any[];
    _currentStr: number;
    _tag: any;
    _fixedNumeration: boolean;
    _numeration: boolean;
    _tagStrNum: number;
    getResult(): string;
    _currentStrLength(): any;
    newTag(tag: any, numeration: any): void;
    newString(tag: any): void;
    writeEntireString(string: any, maxStrPos: any, concat: any): void;
    writeString(string: any, begin: any, end: any): void;
    writeBondsArray(bonds: any, atom: any): void;
    _getSubArrays(arr: any, subArraySize: any): any[];
    writeMatrix(matrix: any, matrixIndx: any, tag: any): void;
    writeMatrices(matrices: any, string: any): void;
}
