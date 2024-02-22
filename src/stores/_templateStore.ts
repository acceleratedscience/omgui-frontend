/**
 * This store is responsible for
 */

import { defineStore } from 'pinia'
// import router from '@/router'

// Type declarations
type State = {
	_foo: number
}

export const useSampleStore = defineStore('sampleStore', {
	state: (): State => ({
		_foo: 0,
	}),
	getters: {
		foo(): number {
			return this.foo
		},
	},
	actions: {
		setFoo(nr: number = 1) {
			this._foo = nr
		},
	},
})
