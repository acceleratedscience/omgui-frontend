export default VolumeVisual;
declare class VolumeVisual extends Visual {
    _mesh: VolumeMesh;
    _frame: VolumeBounds;
    _farPlane: VolumeFarPlane;
    getMesh(): VolumeMesh;
    showFrame(needShow: any): void;
}
import Visual from "./Visual";
import VolumeMesh from "./gfx/VolumeMesh";
import VolumeBounds from "./gfx/VolumeBounds";
import VolumeFarPlane from "./gfx/VolumeFarPlane";
