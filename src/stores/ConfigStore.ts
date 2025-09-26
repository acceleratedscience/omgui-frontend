/**
 * Fetches the configuration from the API and stores it in the state.
 */

import { defineStore } from 'pinia'

// API
import { apiFetch, mainApi } from '@/api'

// Type declarations
type State = {
	_config: Record<string, any>
}

export const useConfigStore = defineStore('configStore', {
	state: (): State => ({
		_config: {},
	}),
	getters: {
		config: (state) => state._config,
		stateless: (state) => state._config.stateless || false,
		appName: (state) => state._config.app_name || 'omgui',
		workspace: (state) => state._config.workspace || 'DEFAULT',
		session: (state) => state._config.session || null,
	},
	actions: {
		// Load config from the API
		async load() {
			apiFetch(mainApi.getConfig(), {
				onSuccess: (data) => {
					this._config = data
				},
				onError: (err) => {
					console.error('Failed to load config:', err)
				},
			})
		},
	},
})
