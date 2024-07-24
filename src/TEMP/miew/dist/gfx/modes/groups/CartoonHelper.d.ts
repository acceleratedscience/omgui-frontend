export default CartoonHelper;
declare class CartoonHelper {
    constructor(residues: any, startIdx: any, endIdx: any, segmentsCount: any, tension: any, boundaries: any);
    _topInterp: (t: any, argTrans: any) => any;
    _centerInterp: (t: any, argTrans: any) => any;
    _shift: number;
    _valueStep: number;
    _segmentsCount: any;
    prepareMatrices(idx: any, firstRad: any, secondRad: any): any[];
}
