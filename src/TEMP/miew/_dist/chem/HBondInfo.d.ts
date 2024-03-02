export default class HBondInfo {
    constructor(complex: any);
    _complex: any;
    _hbonds: any[];
    isBond(from: any, to: any): boolean;
    _build(): void;
    _buildVW(): void;
    _residueGetCAlpha(res: any): any;
    _residueGetCO(res: any): null[];
    _residueGetNH(prev: any, res: any): any[];
    _calcHBondEnergy(predonor: any, donor: any, acceptor: any): number;
}
