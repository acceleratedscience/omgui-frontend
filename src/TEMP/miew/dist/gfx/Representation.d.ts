export default Representation;
declare class Representation {
    constructor(index: any, mode: any, colorer: any, selector: any);
    index: any;
    mode: any;
    colorer: any;
    selector: any;
    selectorString: string;
    count: number;
    material: UberMaterial;
    materialPreset: any;
    needsRebuild: boolean;
    visible: boolean;
    markAtoms(complex: any): number;
    unmarkAtoms(complex: any): void;
    setMode(mode: any): void;
    setMaterialPreset(preset: any): void;
    reset(): void;
    geo: any;
    selectionGeo: any;
    buildGeometry(complex: any): any;
    buildSelectionGeometry(mask: any): any;
    /**
     * Create object that represents difference between current and another rep
     * anotherRep could be undefined. In this case everything is reported.
     */
    compare(repSettings: any): {
        selector: string;
        mode: any;
        colorer: any;
        material: any;
    };
    /**
     * Change representation. Write fields what was changed into new object, return it.
     */
    change(repSettings: any, complex: any, mode: any, color: any): {
        selector: string;
        mode: any;
        colorer: any;
        material: any;
    };
    show(visible: any): void;
}
import UberMaterial from "./shaders/UberMaterial";
