/**
 * This store is responsible for storing any general,
 * app-wide state that doesn't require its own store.
 */

import { defineStore } from 'pinia'
import router from '@/router'

export const useMainStore = defineStore('mainStore', {
	state: () => ({
		headless: false, // Causes the modules to display without the application wrapper
	}),
	getters: {
		isHeadless(): boolean {
			return this.headless
		},
	},
	actions: {
		// Turn headless mode ON
		setHeadless(updateRoute: boolean = false) {
			// console.log('setHeadless', updateRoute)
			this.headless = true
			if (updateRoute) {
				const path = router.currentRoute.value.path.replace(/^\/headless/, '')
				router.replace('/headless' + path)
			}
		},

		// Turn headless mode OFF
		unsetHeadless(updateRoute: boolean = false) {
			// console.log('unsetHeadless', updateRoute)
			this.headless = false
			if (updateRoute) {
				const path = router.currentRoute.value.path.replace(/^\/headless/, '')
				router.replace(path)
			}
		},

		// Toggle headless mode
		toggleHeadless(updateRoute: boolean = false) {
			if (this.headless) {
				this.unsetHeadless(updateRoute)
			} else {
				this.setHeadless(updateRoute)
			}
		},
	},
})
