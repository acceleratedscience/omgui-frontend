export default ChemGroup;
declare class ChemGroup extends RCGroup {
    constructor(geoParams: any, selection: any, colorer: any, mode: any, transforms: any, polyComplexity: any, material: any);
    _selection: any;
    _mode: any;
    _colorer: any;
    _chunksIdc: any;
    _polyComplexity: any;
    _geo: any;
    _mesh: TransformGroup;
    _makeGeoArgs(): void;
    _changeSubsetOpacity(mask: any, value: any, innerOnly: any): void;
}
import RCGroup from "../../RCGroup";
import TransformGroup from "../../meshes/TransformGroup";
