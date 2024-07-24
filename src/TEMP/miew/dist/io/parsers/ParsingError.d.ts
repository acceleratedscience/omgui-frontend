export default ParsingError;
declare class ParsingError extends Error {
    constructor(message: any, line: any, column: any);
    parseLine: any;
    parseColumn: any;
}
