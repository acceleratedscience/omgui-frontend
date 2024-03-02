/** Base class for atom selectors. */
export class Selector {
    toString(): string;
    toJSON(): string[];
    name: string;
    keyword: string;
}
/** Base class for list-based atom selectors. */
export class ListSelector extends Selector {
    constructor(list: any);
    list: any;
}
export class RangeListSelector extends ListSelector {
}
export class ValueListSelector extends ListSelector {
    constructor(arg: any, caseSensitive: any);
}
export class NoneSelector extends Selector {
    includesAtom(_atom: any): boolean;
}
export class AllSelector extends Selector {
    includesAtom(_atom: any): boolean;
}
