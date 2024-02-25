/**
 * This store is responsible for storing the molecule data which is displayed in the molecule viewer.
 */

import { defineStore } from 'pinia'

// Type declarations
type State = {
	_mol: object | null
	_sdf: string | null
	_svg: string | null
}

export const useMolViewerStore = defineStore('molViewerStore', {
	state: (): State => ({
		_mol: null,
		_sdf: null,
		_svg: null,
	}),
	getters: {
		mol(): object | null {
			return this._mol
		},
		sdf(): string | null {
			return this._sdf
		},
		svg(): string | null {
			return this._svg
		},
	},
	actions: {
		setMolData(mol: object) {
			this._mol = mol
		},
		setMolVizData(svg: string, sdf: string) {
			this._svg = svg
			this._sdf = sdf
		},
		clearMol() {
			this._mol = null
			this._sdf = null
			this._svg = null
		},
	},
})
