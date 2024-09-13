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
	_screenWidth: number | null
	_contentWidth: number | null
	_onClickAnywhere: (e: MouseEvent) => void
	_blockRouting: boolean
	_scrollY: number
}

export const useMainStore = defineStore('mainStore', {
	state: (): State => ({
		_headless: false, // Causes the modules to display without the application wrapper
		_workspace: null, // The current workspace
		_screenWidth: null, // The available width of the viewport
		_contentWidth: null, // The width of the content area (screen - padding)
		_onClickAnywhere: () => {}, // Executes when the user clicks anywhere on the page
		_blockRouting: false, // Prevents the router from changing routes, including changes to the query
		_scrollY: 0, // The current scroll position
	}),
	getters: {
		headless(): boolean {
			return this._headless
		},
		workspace(): string | null {
			return this._workspace
		},
		screenWidth(): number | null {
			return this._screenWidth
		},
		contentWidth(): number | null {
			return this._contentWidth
		},
		onClickAnywhere(): (e: MouseEvent) => void {
			return this._onClickAnywhere
		},
		blockRouting(): boolean {
			return this._blockRouting
		},
		scrollY(): number {
			return this._scrollY
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

		// Set screen width
		setScreenWidth(width: number) {
			this._screenWidth = width
		},

		// Set content width
		setContentWidth(width: number) {
			this._contentWidth = width
		},

		// Set onBlur function
		setOnClickAnywhere(fn: (e: MouseEvent) => void) {
			this._onClickAnywhere = fn
		},

		// Set blockRouting
		setBlockRouting(bool: boolean) {
			this._blockRouting = bool
		},

		// Set scroll position
		setScrollY(scrollY: number) {
			this._scrollY = scrollY
		},
	},
})
