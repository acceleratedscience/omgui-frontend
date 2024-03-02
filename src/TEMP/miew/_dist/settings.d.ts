declare var _default: Settings;
export default _default;
/**
 * Polygonal complexity settings.
 */
export type PolyComplexity = {
    poor: number;
    low: number;
    medium: number;
    high: number;
    ultra: number;
};
declare function Settings(): void;
declare class Settings {
    old: any;
    now: {};
    _changed: {};
}
