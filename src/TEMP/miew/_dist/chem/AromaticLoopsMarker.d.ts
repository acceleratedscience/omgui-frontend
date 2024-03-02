export default AromaticLoopsMarker;
declare class AromaticLoopsMarker {
    constructor(complex: any);
    _complex: any;
    _bondsData: any[];
    _bondMarks: any[];
    _resetCycles(): void;
    _cycles: any[] | undefined;
    _currIdx: number | undefined;
    _haveSameCycle(bondsData: any, bond1: any, bond2: any): boolean;
    _tryBond(prevBond: any, currRight: any, currDir: any): boolean;
    _startCycle(bond: any): void;
    _currStart: any;
    _findLoops(checkBond: any, checkCycle: any): void;
    _checkBond: any;
    markCycles(): void;
    detectCycles(): void;
}
