export default ParserList;
/**
 * A list of available parsers.
 * @extends EntityList
 */
declare class ParserList extends EntityList {
    /**
     * Create a list of parsers.
     * The parsers are indexed by supported data formats and file extensions (`.formats` and
     * `.extensions` properties of a Parser subclass).
     * The parsers can be retrieved later by matching against specs (see {@link ParserList#find}).
     *
     * @param {!Array<function(new:Parser)>=} someParsers A list of {@link Parser} subclasses to
     *   automatically register at creation time.
     * @see ParserList#register
     */
    constructor(someParsers?: Array<new () => Parser> | undefined);
    /**
     * Find a suitable parser for data.
     *
     * @param {Object} specs Parser specifications.
     * @param {string=} specs.format Supported data format.
     * @param {string=} specs.ext Supported filename extension.
     * @param {*=} specs.data Data to parse.
     */
    find(specs: {
        format?: string | undefined;
        ext?: string | undefined;
        data?: any | undefined;
    }): any[];
}
import EntityList from "../../utils/EntityList";
