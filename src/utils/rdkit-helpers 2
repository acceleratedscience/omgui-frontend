/**
 * Helper functions for working with RDKit.
 */

import type { JSMol } from '@/utils/rdkit/tsTypes'

// Validate the string representation of the molecule
export function isValidMolString(s: string) {
	const mol = window.RDKit.get_mol(s || 'invalid')
	const isValidMol = isValid(mol)
	mol?.delete()
	return isValidMol
}

// Validate the molecule
export function isValid(m: JSMol | null) {
	return !!m
}
