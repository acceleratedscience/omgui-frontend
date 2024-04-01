import type { Directive } from 'vue'

// Validator function that can block the functianlity.
let validator: (() => boolean) | boolean = true

// Allow elements to be copied to the clipboard when clicked.
// <div v-copy-on-click>ABC</div>
// <div v-copy-on-click="checkSomeState">ABC</div>
// <div v-copy-on-click data-copy="XYZ">ABC</div>
const copyOnClick: Directive = {
	beforeMount(el, binding) {
		// console.log('Validator: ', binding.value)
		validator = binding.value
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
	// 	console.log('Validator result:', validator())
	// }
	if ((!validator && validator != undefined) || (validator instanceof Function && !validator())) return
	const el: HTMLElement | null = e.target as HTMLElement
	if (!el) return
	const text = el.getAttribute('data-copy') || el.innerText
	navigator.clipboard.writeText(text)
	el.classList.add('copy-blink')
	setTimeout(() => el.classList.remove('copy-blink'), 500)
}

export default copyOnClick
