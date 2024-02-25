/**
 * This store is responsible for storing the different
 * API instances, so they are not re-created every time.
 * - - -
 * Every category of API (e.g. fileSystem, user, etc.) has
 * its own class in the ApiService file.
 */

import { defineStore } from 'pinia'

// Api classes
import * as ApiService from '@/api/ApiService'

// Helpers
import { capitalize } from '@/utils/helpers'

// Type declarations
import type { FileSystemApi } from '@/api/ApiService'
type State = {
	apiInstances: Record<string, FileSystemApi | null> // <-- Other APIs need to be added here
}

export const useApiStore = defineStore('apiStore', {
	state: (): State => ({
		apiInstances: {
			main: null,
			fileSystem: null,
			molecules: null,
		},
	}),
	actions: {
		loadApi(name: any) {
			if (!this.apiInstances[name]) {
				const apiClassName: string = capitalize(name) + 'Api'
				this.apiInstances[name] = new (ApiService as any)[apiClassName]()
			}
			return this.apiInstances[name]
		},
	},
})
