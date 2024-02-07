import { defineStore } from 'pinia'
import router from '@/router'

export const useMainStore = defineStore('counter', {
	state: () => ({
		headless: false,
	}),
	getters: {
		isHeadless(): boolean {
			return this.headless
		},
	},
	actions: {
		// Turn ON
		setHeadless(updateRoute: boolean = false) {
			// console.log('setHeadless', updateRoute)
			this.headless = true
			if (updateRoute) {
				const path = router.currentRoute.value.path.replace(/^\/headless/, '')
				// history.replaceState({}, '', path)
				router.replace('/headless' + path)
			}
		},

		// Turn OFF
		unsetHeadless(updateRoute: boolean = false) {
			// console.log('unsetHeadless', updateRoute)
			this.headless = false
			if (updateRoute) {
				const path = router.currentRoute.value.path.replace(/^\/headless/, '')
				// history.replaceState({}, '', path)
				router.replace(path)
			}
		},

		// Toggle
		toggleHeadless(updateRoute: boolean = false) {
			if (this.headless) {
				this.unsetHeadless(updateRoute)
			} else {
				this.setHeadless(updateRoute)
			}
		},
	},
})
