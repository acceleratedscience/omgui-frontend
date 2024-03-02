export default ThickLinesGeometry;
/**
 * This class represents lines geometry which consists of screen-aligned narrow quad of variable width.
 *
 * @constructor
 *
 * @param {number}  segmentsCount   Number of segments per chunk.
 * collision geometry.
 */
declare class ThickLinesGeometry {
    constructor(segmentsCount: any);
    startUpdate(): boolean;
    finishUpdate(): void;
    setColor(segmentIdx: any, colorVal: any): void;
    setSegment(segmentIdx: any, pos1: any, pos2: any): void;
    setOpacity(startSegIdx: any, endSegIdx: any, value: any): void;
    getSubsetSegments(startSegmentIdx: any, segmentsCount: any): any[];
    getSubsetColors(startSegmentIdx: any, segmentsCount: any): any;
    getSubsetOpacities(startSegmentIdx: any, segmentsCount: any): any;
    getNumVertexPerSegment(): number;
    getPositionSize(): number;
    setSegments(startSegmentIdx: any, positions: any): void;
    setColors(startSegmentIdx: any, colors: any): void;
    _initVertices(segmentsCount: any): void;
    _buffersSize: number | undefined;
    _index: any;
    _positions: any;
    _colors: any;
    _directions: any;
    _alpha: any;
}
