declare class SecondaryStructureMap {
    constructor(complex: any);
    _complex: any;
    _build(): void;
    _hbonds: HBondInfo | undefined;
    _ss: any[] | undefined;
    _sheet: any[] | undefined;
    _betaPartners: any[] | undefined;
    _bend: any[] | undefined;
    _helixFlags: any[] | undefined;
    _chainLengths: any[] | undefined;
    _buildAlphaHelices(inResidues: any, chainLength: any, inPreferPiHelices: any): void;
    _residueGetCAlpha(res: any): any;
    _cosinusAngle(p1: any, p2: any, p3: any, p4: any): number;
    _kappa(prevPrev: any, res: any, nextNext: any): number;
    _isHelixStart(res: any, stride: any): boolean;
    _buildBetaSheets(): void;
    _testBridge(chainA: any, from: any, chainB: any, to: any): number;
    _areBridgesLinked(a: any, b: any): boolean;
    _hasChainBreak(from: any, to: any): boolean;
}
declare namespace SecondaryStructureMap {
    export { StructureType };
}
export default SecondaryStructureMap;
import HBondInfo from "./HBondInfo";
declare const StructureType: Readonly<{
    STRAND: string;
    BRIDGE: string;
    HELIX_310: string;
    HELIX_ALPHA: string;
    HELIX_PI: string;
    TURN: string;
    BEND: string;
    LOOP: string;
}>;
