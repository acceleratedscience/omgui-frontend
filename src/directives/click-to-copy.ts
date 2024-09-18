import type { Directive } from 'vue'

// Add _validator to tghe global HTMLElement interface,
// so we can use it in the directive.
declare global {
	interface HTMLElement {
		_validator?: (() => boolean) | boolean
	}
}

// Allow elements to be copied to the clipboard when clicked.
// <div v-click-to-copy>ABC</div>
// <div v-click-to-copy="checkSomeState">ABC</div>
// <div v-click-to-copy data-copy="XYZ">ABC</div>
const copyOnClick: Directive = {
	beforeMount(el, binding) {
		// console.log('Validator: ', binding.value)
		// Validator function that can block the functianlity.
		el._validator = binding.value

		if (binding.value === false) return
		if (!el.classList.contains('click-copy')) el.classList.add('click-copy')
		el.addEventListener('click', _onClick)
	},
	beforeUnmount(el) {
		el.removeEventListener('click', _onClick)
	},
}

function _onClick(e: MouseEvent) {
	// if (validator instanceof Function) {
	// 	console.log('Validator result:', el.validator())
	// }
	const el: HTMLElement | null = e.currentTarget as HTMLElement
	if ((!el._validator && el._validator != undefined) || (el._validator instanceof Function && !el._validator())) return
	if (!el) return
	const text = el.getAttribute('data-copy') || el.innerText
	navigator.clipboard.writeText(text)
	el.classList.add('copy-blink')
	setTimeout(() => el.classList.remove('copy-blink'), 500)
}

export default copyOnClick
