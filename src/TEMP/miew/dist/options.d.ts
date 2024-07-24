declare namespace _default {
    export { fromURL };
    export { fromAttr };
    export { adapters };
    export { toURL };
    export { toScript };
}
export default _default;
declare function fromURL(url: any): {};
declare function fromAttr(attr: any): {};
declare namespace adapters {
    export const string: StringConstructor;
    export const number: NumberConstructor;
    export { asBoolean as boolean };
}
declare function toURL(opts: any): string;
declare function toScript(opts: any): string;
declare function asBoolean(value: any): boolean;
