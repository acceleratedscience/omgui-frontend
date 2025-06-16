/**
 * This store is responsible for
 */

// Vue
import { defineStore } from 'pinia'

// Stores
import { useCommandLineStore } from '@/stores/CommandLineStore'

// API
import { apiFetch, mainApi } from '@/api'

// Utils
import { lockScroll } from '@/utils/helpers'

// Type declarations
type State = {
	_active: boolean
	_loading: boolean
	_input: string
	_output: string[]
	_errorMsg: string
	_errorData: string
	_callback: Function
}

function getInitialState(): State {
	return {
		_active: false, // Toggles the assisant
		_loading: false,
		_input: '', // Content of the text area
		_output: [], // Conversaion history
		_errorMsg: '',
		_errorData: '',
		_callback: () => {},
	}
}

export const useAssistantStore = defineStore('assistantStore', {
	state: () => getInitialState(),
	getters: {
		active(): boolean {
			return this._active
		},
		loading(): boolean {
			return this._loading
		},
		input(): string {
			return this._input
		},
		output(): string[] {
			return this._output
		},
		errorMsg(): string {
			return this._errorMsg
		},
		errorData(): string {
			return this._errorData
		},
	},
	actions: {
		setActive(state: boolean = true) {
			this._active = state
			if (state) {
				const commandLineStore = useCommandLineStore()
				commandLineStore.setActive(false)
			}
			lockScroll(state)
		},
		setLoading(state: boolean = true) {
			this._loading = state
		},
		addOutput(output: string) {
			this._output.push(output)
		},
		setInput(input: string) {
			this._input = input
		},
		clearInput() {
			this._input = ''
		},
		clearOutput() {
			this._output = []
		},
		setErrorMsg(msg: string) {
			this._errorMsg = msg
		},
		setErrorData(data: string) {
			this._errorData = data
		},
		setCallback(callback: () => void) {
			this._callback = callback
		},
		callback() {
			this._callback()
		},
		onKeyDown(e: KeyboardEvent) {
			if (e.key === 'Enter' && !e.shiftKey) {
				// Submit
				this.submit()
				e.preventDefault()
			} else if (e.metaKey && e.key === 'k') {
				// Clear
				this.clearOutput()
			} else if (e.key == 'Escape') {
				// Close
				this.setActive(false)
			}
		},
		async submit(callback: Function = () => {}) {
			apiFetch(mainApi.execCommand(this.input), {
				setLoading: this.setLoading,
				onError: (err) => {
					// console.log(88, err)
					const errMsg = 'Failed to execute command: ' + err.statusText
					this.setErrorMsg(errMsg)
					this.setErrorData(err.data)
					console.error(errMsg)
				},
				onSuccess: (data) => {
					// console.log(99, data)
					this.addOutput(data)
					this.clearInput()
					this.callback()
				},
			})
		},
	},
})
