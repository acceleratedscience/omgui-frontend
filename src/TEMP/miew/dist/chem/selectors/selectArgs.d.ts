export class Range {
    constructor(min: any, max: any);
    min: any;
    max: any;
    includes(value: any): boolean;
    toString(): string;
    toJSON(): any[];
}
export class List {
    constructor(arg: any);
    _values: any[] | undefined;
    append(value: any): List;
    remove(value: any): List;
    toString(): string;
    toJSON(): any[];
}
export class RangeList extends List {
    includes(value: any): boolean;
}
export class ValueList extends List {
    constructor(arg: any, upperOnly: any);
    upperOnly: boolean;
    includes(value: any): boolean;
    _validate(value: any): any;
}
