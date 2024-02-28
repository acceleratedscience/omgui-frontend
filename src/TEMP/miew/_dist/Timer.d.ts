declare class Timer {
    startTime: number;
    oldTime: number;
    elapsedTime: number;
    running: boolean;
    start(): void;
    stop(): void;
    getElapsedTime(): number;
    update(): number;
}
declare namespace Timer {
    const now: () => number;
}
export default Timer;
