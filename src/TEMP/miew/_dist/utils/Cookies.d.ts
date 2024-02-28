export default Cookies;
/**
 * Create new context dependent Cookie holder object.
 * @param context
 * @param {Object} opts - options
 * @param {string} opts.path - cookie path
 * @constructor
 */
declare function Cookies(context: any, opts: {
    path: string;
}): void;
declare class Cookies {
    /**
     * Create new context dependent Cookie holder object.
     * @param context
     * @param {Object} opts - options
     * @param {string} opts.path - cookie path
     * @constructor
     */
    constructor(context: any, opts: {
        path: string;
    });
    context: any;
    _opts: {
        path: string;
    } & {
        path: string;
    };
    /**
     * Remove cookie by the name.
     * @param key
     */
    removeCookie(key: any): void;
    /**
     * Set new cookie value. Automatically splits
     * values that are too large into multiple cookies.
     * @param key
     * @param value
     */
    setCookie(key: any, value: any): void;
    /**
     * Obtain the value of a compound cookie.
     * @param key
     */
    getCookie(key: any): string;
    _toCount(key: any): string;
    _removeSimpleCookie(key: any): void;
    _getExpirationDate(): Date;
    _setSimpleCookie(key: any, value: any): void;
    _getSimpleCookie(key: any): string;
    _exists(key: any): RegExpMatchArray | null;
}
