export default Element;
declare class Element {
    static Constants: {
        U1: number;
        Lead: number;
        U2: number;
        Wing: number;
        U18: number;
    };
    static Role: {
        N: number;
        CA: number;
        C: number;
        O: number;
        SG: number;
    };
    static ByAtomicNumber: (Element | null)[];
    static ByName: {
        D: Element;
        T: Element;
    };
    constructor(number: any, name: any, fullName: any, weight: any, radius: any, radiusBonding: any, hValency: any);
    number: any;
    name: any;
    fullName: any;
    weight: any;
    radius: any;
    radiusBonding: any;
    hydrogenValency: any;
}
declare namespace Element {
    function getByName(element: any): any;
}
