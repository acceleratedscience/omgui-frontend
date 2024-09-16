/**
 * This store is responsible for controling the modal.
 * - - -
 * For examples on how to use the modal, see KitchenSink.vue
 */

import { defineStore } from 'pinia'

// Utils
import { lockScroll } from '@/utils/helpers'

// Type declarations
type Size = 'xs' | 'sm' | 'md' | 'lg'
type Data = { [key: string]: any }
type State = {
	_visible: boolean
	//
	_modalName: string | null
	_data: Data
	//
	_html: boolean
	_content: string | null
	_size: Size | null
	_label: string | null
	_title: string | null
	_primaryBtn: string | null
	_secondaryBtn: string | null
	_otherBtn: string | null
	_onSubmit: Function | null
	_onCancel: Function | null
	_onOther: Function | null
}

export const useModalStore = defineStore('modalStore', {
	state: (): State => ({
		_visible: false,

		// Name of the template holding the modal content.
		// When this is set, a custom template is displayed
		// and all other parameters are ignored.
		_modalName: null,
		// Data object with key-value pairs that can be used in the dialog.
		// This is useful for dialog-specific v-model bindings etc.
		// See ModalSaveFile for an example.
		_data: {},

		// When no template is set, ModalMain is loaded,
		// and the following parameters are used.
		_html: false,
		_content: null,
		_size: null,
		_label: null,
		_title: null,
		_primaryBtn: null,
		_secondaryBtn: null,
		_otherBtn: null,
		_onSubmit: null,
		_onCancel: null,
		_onOther: null,
	}),
	getters: {
		// active(): boolean {
		// 	return this._active
		// },
		visible(): boolean {
			return this._visible
		},

		//

		modalName(): string | null {
			return this._modalName
		},
		data(): Data {
			return this._data
		},

		//
		html(): boolean {
			return this._html
		},
		content(): string | null {
			return this._content
		},
		size(): Size {
			return this._size || 'xs'
		},
		label(): string | null {
			return this._label
		},
		title(): string | null {
			return this._title
		},
		primaryBtn(): string | null {
			return this._primaryBtn
		},
		secondaryBtn(): string | null {
			return this._secondaryBtn
		},
		otherBtn(): string | null {
			return this._otherBtn
		},
		onSubmit(): Function | null {
			return this._onSubmit
		},
		onCancel(): Function | null {
			return this._onCancel
		},
		onOther(): Function | null {
			return this._onOther
		},
	},
	actions: {
		show() {
			this._visible = true
			lockScroll(true)
			// console.log('modalStore show')
		},
		hide() {
			this._visible = false
			lockScroll(false)
			// console.log('modalStore hide')
		},

		// Display a custom modal.
		display(
			templateName: string,
			data: Data | null = null,
			options: {
				onSubmit?: Function
				onCancel?: Function
				onOther?: Function
			} = {},
		): Promise<boolean> {
			this._modalName = templateName
			if (data) this._data = data
			// this.show() is triggered in the onMounted hook
			// with a few ms delay, to ensure the intro animation
			// is played. See _ModalTemplate.vue.

			return new Promise((resolve) => {
				this._onSubmit = (submitData: Record<string, any>) => {
					if (options.onSubmit) options.onSubmit(submitData)
					this.hide()
					resolve(true)
				}
				this._onCancel = () => {
					if (options.onCancel) options.onCancel()
					this.hide()
					resolve(false)
				}
				this._onOther = options.onOther || null
			})
		},

		// Display a regular text modal.
		alert(
			content: string,
			options: {
				html?: boolean
				size?: Size
				title?: string
				primaryBtn?: string | boolean
				secondaryBtn?: string | boolean
				otherBtn?: string
				onSubmit?: Function
				onCancel?: Function
				onOther?: Function
			} = {},
		): Promise<boolean> {
			this._modalName = 'ModalMain'
			this._content = content
			this._html = options.html || false
			this._size = options.size || null
			this._title = options.title || null
			this._primaryBtn = options.primaryBtn === true ? 'Ok' : options.primaryBtn ? options.primaryBtn : 'Ok'
			this._secondaryBtn = options.secondaryBtn === true ? 'Cancel' : options.secondaryBtn ? options.secondaryBtn : null
			this._otherBtn = options.otherBtn || null
			return new Promise((resolve) => {
				this._onSubmit = () => {
					if (options.onSubmit) options.onSubmit()
					this.hide()
					resolve(true)
				}
				this._onCancel = () => {
					if (options.onCancel) options.onCancel()
					this.hide()
					resolve(false)
				}
				this._onOther = options.onOther || null
			})
		},

		alertPromise(content: string, options: Record<string, any> = {}) {
			return new Promise((resolve) => {
				options.onSubmit = () => resolve(true)
				options.onCancel = () => resolve(false)
				this.alert(content, options)
			})
		},

		// Display a confirm modal.
		confirm(content: string, options: Record<string, any> = {}) {
			options.primaryBtn = 'Confirm'
			options.secondaryBtn = 'Cancel'
			return this.alert(content, options)
		},

		setData(data: Data) {
			for (const key in data) {
				this._data[key] = data[key]
			}
		},

		clear() {
			// console.log('modalStore clear')
			this._visible = false
			this._modalName = null
			this._data = {}
			this._label = null
			this._title = null
			this._content = null
			this._primaryBtn = null
			this._secondaryBtn = null
			this._otherBtn = null
			lockScroll(false)
		},
	},
})
