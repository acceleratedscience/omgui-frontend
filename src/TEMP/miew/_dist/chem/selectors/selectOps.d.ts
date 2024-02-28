export class PrefixOperator extends Selector {
    constructor(rhs: any);
    rhs: any;
    priority: number;
}
export class InfixOperator extends Selector {
    constructor(lhs: any, rhs: any);
    lhs: any;
    rhs: any;
    priority: number;
}
import { Selector } from "./selectorsBase";
