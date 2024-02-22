// TRASH

/**
 * This store is responsible for storing popstate callbacks
 * that are executed after the route finishes loading.
 * - - -
 * This is to prevent undesirable behavior where popstate
 * is otherwise called before the page has had a chance to
 * unmount, causing callbacks to be wrongly triggered.
 */

import { defineStore } from 'pinia'

// Type declarations
type State = {
	_popState: boolean
	_callbacks: (() => void)[]
}

export const usePopStateStore = defineStore('popStateStore', {
	state: (): State => ({
		// With every popstate event (history fwd/bck), this is set to true.
		// When the route finishes loading (after afterEach), we check if
		// popstate is true and call the popstateCallbacks.
		_popState: false,
		_callbacks: [],
	}),
	getters: {
		popstate(): boolean {
			return this._popState
		},
	},
	actions: {
		setPopState() {
			console.log('SET')
			this._popState = true
		},
		unsetPopState() {
			console.log('UNSET')
			this._popState = false
		},
		addCallback(fun: () => void) {
			this._callbacks.push(fun)
		},
		removeCallback(fun: () => void) {
			this._callbacks = this._callbacks.filter((cb) => cb !== fun)
		},
		execute() {
			this._callbacks.forEach((cb) => cb())
		},
	},
})
