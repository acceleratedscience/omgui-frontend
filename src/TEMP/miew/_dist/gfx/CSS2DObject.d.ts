export default CSS2DObject;
declare class CSS2DObject {
    constructor(element: any);
    _element: any;
    getElement(): any;
    /**
     * Sets label transparency.
     *
     * @param {number} transp    - in [0; 1] 1 means fully transparent
     */
    setTransparency(transp: number): void;
    clone(): CSS2DObject;
}
