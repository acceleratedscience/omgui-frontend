/**
 * This store is responsible for
 */

import { defineStore } from 'pinia'
// import router from '@/router'

export const useSampleStore = defineStore('sampleStore', {
	state: () => ({
		foo: 0,
	}),
	getters: {
		getFoo(): number {
			return this.foo
		},
	},
	actions: {
		setFoo(nr: number = 1) {
			this.foo = nr
		},
	},
})
