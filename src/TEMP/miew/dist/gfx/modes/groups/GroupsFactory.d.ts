export default GroupsFactory;
declare class GroupsFactory {
    static AtomsSpheres(caps: any, settings: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static OrphanedAtomsCrosses(caps: any, settings: any, renderParams: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static BondsCylinders(caps: any, settings: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static BondsLines(caps: any, settings: any, renderParams: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static CartoonChains(caps: any, settings: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static TraceChains(caps: any, settings: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static NucleicSpheres(caps: any, settings: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static NucleicCylinders(caps: any, settings: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static ALoopsTorus(caps: any, settings: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static ALoopsLines(caps: any, settings: any, renderParams: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static QuickSurfGeo(caps: any, settings: any, renderParams: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static ContactSurfaceGeo(caps: any, settings: any, renderParams: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static SASSESSurfaceGeo(caps: any, settings: any, renderParams: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
    static TextLabelsGeo(caps: any, settings: any): (complex: any, colorer: any, mode: any, polyComplexity: any, mask: any, material: any) => any;
}
