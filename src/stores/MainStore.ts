/**
 * This store is responsible for storing any general,
 * app-wide state that doesn't require its own store.
 */

import { defineStore } from 'pinia'
import router from '@/router'

// Type declarations
type State = {
	_headless: boolean
	_workspace: string | null
}

export const useMainStore = defineStore('mainStore', {
	state: (): State => ({
		_headless: false, // Causes the modules to display without the application wrapper
		_workspace: null, // The current workspace
	}),
	getters: {
		headless(): boolean {
			return this._headless
		},
		workspace(): string | null {
			return this._workspace
		},
	},
	actions: {
		// Turn headless mode ON
		setHeadless(updateRoute: boolean = false) {
			// console.log('setHeadless', updateRoute)
			this._headless = true
			if (updateRoute) {
				const path = router.currentRoute.value.path.replace(/^\/headless/, '')
				router.replace('/headless' + path)
			}
		},

		// Turn headless mode OFF
		unsetHeadless(updateRoute: boolean = false) {
			// console.log('unsetHeadless', updateRoute)
			this._headless = false
			if (updateRoute) {
				const path = router.currentRoute.value.path.replace(/^\/headless/, '')
				router.replace(path)
			}
		},

		// Toggle headless mode
		toggleHeadless(updateRoute: boolean = false) {
			if (this._headless) {
				this.unsetHeadless(updateRoute)
			} else {
				this.setHeadless(updateRoute)
			}
		},

		// Set current workspace
		setWorkspace(workspace: string | null) {
			this._workspace = workspace
		},
	},
})
