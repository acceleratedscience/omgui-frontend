export default Assembly;
/**
 * Biological assembly.
 *
 * @exports Assembly
 * @constructor
 */
declare class Assembly extends BiologicalUnit {
    chains: any[];
    matrices: any[];
    /**
     * Mark a chain as belonging to this biological assembly.
     * @param {string} chain - chain identifier, usually a single letter
     */
    addChain(chain: string): void;
    /**
     * Add a transformation matrix.
     * @param {Matrix4} matrix - transformation matrix
     */
    addMatrix(matrix: Matrix4): void;
}
import BiologicalUnit from "./BiologicalUnit";
