/**
 * This store is responsible for storing the molecule data which is displayed in the molecule viewer.
 */

import { defineStore } from 'pinia'
// import router from '@/router'

import {
	mol as defaultMol,
	molSdf as defaultMolSdf,
	molSvg as defaultMolSvg,
} from '@/utils/temp-mol-data'

// Type declarations
type State = {
	_identifier: string | null
	_mol: object | null
	_sdf: string | null
	_svg: string | null
}

export const useMolViewerStore = defineStore('molViewerStore', {
	state: (): State => ({
		_identifier: null,
		_mol: defaultMol,
		_sdf: defaultMolSdf,
		_svg: defaultMolSvg,
	}),
	getters: {
		identifier(): string | null {
			return this._identifier
		},
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
		setIdentifier(identifier: string) {
			this._identifier = identifier
		},
		setMol(mol: object, sdf: string, svg: string) {
			this._mol = mol
			this._sdf = sdf
			this._svg = svg
		},
	},
})
