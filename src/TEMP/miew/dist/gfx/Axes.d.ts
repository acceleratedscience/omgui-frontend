export default Axes;
declare class Axes {
    constructor(target: any, targetCamera: any);
    _target: any;
    _targetCamera: any;
    _camera: any;
    _object: any;
    _scene: any;
    _full: any;
    _update(): void;
    render(renderer: any): void;
}
