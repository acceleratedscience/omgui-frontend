export default FrameInfo;
declare class FrameInfo {
    /**
     * Returns link to atom pos vector, clone it if needed
     */
    static _vec: any;
    constructor(complex: any, payload: any, callbacks: any);
    _complex: any;
    _secondary: any;
    isLoading: boolean;
    _framesRange: {
        start: number;
        end: number;
    };
    frameIsReady: boolean;
    _buffer: {
        state?: undefined;
    } | {
        state: string;
    } | null;
    _frameRequest: any;
    _callbacks: any;
    _framesRequestLength: number | undefined;
    _downloadDataFn: any;
    _prepareBuffer(framesStart: any, framesEnd: any): void;
    _parseBuffer(): void;
    parseBinaryData(arrayBuffer: any): void;
    _framesCount: number | undefined;
    _atomsCount: number | undefined;
    _timeStep: string | undefined;
    _secondaryData: {
        start: number;
        end: number;
        type: string;
    }[][] | undefined;
    _data: Float32Array | undefined;
    nextFrame(): void;
    needsColorUpdate(colorer: any): boolean;
    getAtomColor(colorer: any, atom: any): any;
    getResidueColor(colorer: any, residue: any): any;
    _updateSecondary(): void;
    reset(): void;
    _residues: any[] | undefined;
    setFrame(frameIdx: any): void;
    _currFrame: any;
    _cachedResidues: boolean | undefined;
    disableEvents(): void;
    getAtomPos(atomIdx: any): any;
    getResidues(): any[] | undefined;
}
