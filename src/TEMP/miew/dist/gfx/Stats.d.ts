export default Stats;
declare class Stats {
    domElement: any;
    _text: any;
    _startTime: number;
    _prevTime: number;
    _deltas: any[];
    _index: number;
    _total: number;
    _count: number;
    end(): number;
    ms: number | undefined;
    fps: number | undefined;
    update(): void;
    show(on: any): void;
}
