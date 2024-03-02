export default RCGroup;
declare class RCGroup {
    raycast(raycaster: any, intersects: any): void;
    enableSubset(mask: any, innerOnly: any): void;
    disableSubset(mask: any, innerOnly: any): void;
    isEmpty(): boolean;
    updateToFrame(frameData: any): void;
    getSubset(mask: any, innerOnly: any): any[];
}
