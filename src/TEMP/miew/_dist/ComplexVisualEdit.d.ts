declare namespace _default {
    export { ComplexComponentEditor as ComponentEditor };
    export { ComplexFragmentEditor as FragmentEditor };
}
export default _default;
declare class ComplexComponentEditor {
    constructor(complexVisual: any);
    _complexVisual: any;
    _inProgress: boolean;
    begin(): boolean;
    _componentTransforms: any[] | undefined;
    apply(): void;
    discard(): void;
    getAltObj(): {
        objects: never[];
        pivot: any;
    };
    _bakeComponentTransform(component: any): void;
    _resetComponentTransform(): void;
}
declare class ComplexFragmentEditor {
    constructor(complexVisual: any);
    _complexVisual: any;
    _inProgress: boolean;
    begin(): boolean;
    _fragmentBoundAtoms: any[] | undefined;
    _fragmentGeo: any;
    _fragmentSelectionGeo: any;
    apply(): void;
    discard(): void;
    isFreeRotationAllowed(): boolean;
    getAltObj(): {
        objects: never[];
        pivot: any;
    };
    _getSelectionBorderAtoms(): any[];
    _bakeAtomTransform(matrix: any, mask: any): void;
}
