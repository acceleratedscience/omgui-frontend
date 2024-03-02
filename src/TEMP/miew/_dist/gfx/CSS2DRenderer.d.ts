export default CSS2DRenderer;
declare class CSS2DRenderer {
    _width: number;
    _height: number;
    _widthHalf: number;
    _heightHalf: number;
    _vector: any;
    _viewMatrix: any;
    _projectionMatrix: any;
    _domElement: HTMLDivElement;
    getElement(): HTMLDivElement;
    reset(): void;
    setSize(width: any, height: any): void;
    _renderObject(object: any, camera: any, scene: any): void;
    render(scene: any, camera: any): void;
}
