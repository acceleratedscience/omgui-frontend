/**
 * This store is responsible for
 */

import { defineStore } from 'pinia'
// import router from '@/router'

// Type declarations
type State = {
	_active: boolean
	_modalName: string | null
	_label: string | null
	_title: string | null
	_content: string | null
	_primaryBtn: string | null
	_secondaryBtn: string | null
	_otherBtn: string | null
}

export const useModalStore = defineStore('modalStore', {
	state: (): State => ({
		_active: false,

		// Name of the template holding the modal content.
		// When this is set, a custom template is displayed
		// and all other parameters are ignored.
		_modalName: null,

		// When no template is set, ModalMain is loaded,
		// and the following parameters are used.
		_label: null,
		_title: 'Alert', // The title can't be blank or component with render with 'Modal Title' default
		_content: null,
		_primaryBtn: null,
		_secondaryBtn: null,
		_otherBtn: null,
	}),
	getters: {
		active(): boolean {
			return this._active
		},
		modalName(): string {
			return this._modalName ? this._modalName : 'ModalMain'
			// return this._modalName
		},
		label(): string | null {
			return this._label
		},
		title(): string | null {
			return this._title
		},
		content(): string | null {
			return this._content || 'Hello world'
		},
		primaryBtn(): string | null {
			return this._primaryBtn || 'Submit'
		},
		secondaryBtn(): string | null {
			return this._secondaryBtn || 'Cancel'
		},
		otherBtn(): string | null {
			return this._otherBtn
		},
	},
	actions: {
		// Display a custom modal.
		display(templateName: string) {
			this._active = true
			this._modalName = templateName
		},

		// Display a regular text modal.
		alert(
			content: string,
			options: {
				title?: string
				primaryBtn?: string
				secondaryBtn?: string
				otherBtn?: string
			},
		) {
			this._active = true
			this._title = options.title || 'Warning'
			this._content = content
			if (options.primaryBtn) this._primaryBtn = options.primaryBtn
			if (options.secondaryBtn) this._secondaryBtn = options.secondaryBtn
			if (options.otherBtn) this._otherBtn = options.otherBtn
		},

		// Display a confirm modal.
		confirm(
			content: string,
			options: {
				title?: string
				primaryBtn?: string
				secondaryBtn?: string
				otherBtn?: string
			},
		) {
			this._active = true
			this._title = options.title || 'Confirm'
			this._content = content
			this._primaryBtn = options.primaryBtn || 'Confirm'
			this._secondaryBtn = options.secondaryBtn || 'Cancel'
			if (options.otherBtn) this._otherBtn = options.otherBtn
		},

		clear() {
			console.log('modalStore clear')
			this._active = false
			this._modalName = null
			this._label = null
			this._title = 'Alert'
			this._content = null
			this._primaryBtn = null
			this._secondaryBtn = null
			this._otherBtn = null
		},
	},
})
