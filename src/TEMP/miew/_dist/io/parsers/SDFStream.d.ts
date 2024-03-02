export default class SDFStream {
    constructor(data: any);
    _strings: any;
    _currentStart: number;
    _currentStringIndx: number;
    setStart(start: any): void;
    getNextString(): any;
    getCurrentString(): any;
    getStringFromStart(numb: any): any;
    findNextDataItem(): boolean;
    findNextCompoundStart(): boolean;
    probablyHaveDataToParse(): boolean;
}
