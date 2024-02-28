export default LabelsGeometry;
declare class LabelsGeometry extends EventDispatcher {
    constructor(instanceCount: any, opts: any);
    _opts: any;
    items: any[];
    needsUpdate: boolean;
    userData: {
        translation: string;
        offset: any;
    };
    setItem(itemIdx: any, itemPos: any, fieldTxt: any): void;
    setColor(itemIdx: any, fColor: any, bColor: any): void;
    startUpdate(): boolean;
    finishUpdate(): void;
    finalize(): void;
    raycast(): void;
    setOpacity(): void;
    getSubset(): never[];
}
import EventDispatcher from "../../utils/EventDispatcher";
