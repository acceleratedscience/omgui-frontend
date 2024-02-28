export default AtomPairs;
declare class AtomPairs {
    constructor(maxPairsEstimate: any);
    numPairs: number;
    numMaxPairs: any;
    intBuffer: any;
    hashBuffer: any;
    /**
     * Destroy all pairs memory
     */
    destroy(): void;
    /**
     * Add pair of atoms to collection
     * @param {number} indexA - Index of the 1st vertex.
     * @param {number} indexB - Index of the 2nd vertex.
     */
    addPair(indexA: number, indexB: number): boolean;
}
