export default Palette;
declare class Palette {
    constructor(name: any, id: any);
    name: any;
    id: any;
    getElementColor(name: any, asIs?: boolean): any;
    getResidueColor(name: any, asIs?: boolean): any;
    getChainColor(name: any): any;
    getSecondaryColor(type: any, asIs?: boolean): any;
    getSequentialColor(index: any): any;
    getGradientColor(value: any, gradientName: any): any;
    getNamedColor(name: any, asIs?: boolean): any;
}
