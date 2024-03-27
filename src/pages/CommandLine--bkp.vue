<template>
	<div id="cli">
		<p>This module is meant as a proof-of-concept to preview how we can run commands from the GUI.</p>
		<p>The returned data is not formatted for web, we'll need to refactor the API for that.</p>
		<p>To try it out, try `list files` or `?` or `intro`</p>
		<div>{{ caretPos }}-{{ caretPosEnd }}</div>
		<div id="ip-wrap">
			<div id="ip-display" v-html="inputWithCaret"></div>
			<!-- <div id="ip-display">{{ inputWithCaret }}</div> -->
			<form id="cli-form" @submit.prevent="submitCommand">
				<textarea
					ref="$ip"
					id="cli-input"
					type="text"
					v-model="input"
					@mouseup="updateCaret"
					@mousedown="updateCaret"
					@mousemove="updateCaret"
					@keydown="updateCaret"
					@blur="$ip?.focus()"
					@select="updateCaret"
				></textarea
				><br /><br />
				<!-- @keyup="updateCaret" -->
				<button type="submit"></button>
			</form>
		</div>

		<br /><br /><b>Output</b>
		<pre>{{ output }}</pre>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, computed, nextTick } from 'vue'
import type { ComputedRef } from 'vue'

// API
import { mainApi } from '@/api/ApiService'

// Definitions
const input = ref<string>('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
const output = ref<string>('')
const $ip = ref<HTMLInputElement | null>(null)
const caretPos = ref<number>(0)
const caretPosEnd = ref<number>(0) // When text is selected

/**
 * Hooks
 */

onMounted(() => {
	$ip.value?.focus()
})

/**
 * Computed
 */

const inputWithCaret: ComputedRef<string> = computed(() => {
	// Replace tab characters with space.
	const ipVal: string = input.value.replace(/\t/g, ' ')

	// Detect if text is selected.
	const hasSel = caretPosEnd.value > caretPos.value
	const selClass = hasSel ? ' sel' : ''

	// Compile text as before + caret/sel + after
	let strBefore: string = ipVal.slice(0, caretPos.value)
	const caretEnd = hasSel ? caretPosEnd.value : caretPosEnd.value + 1
	let strCaret: string = ipVal.slice(caretPos.value, caretEnd) || ' '
	let strAfter: string = hasSel ? input.value.slice(caretPosEnd.value) : input.value.slice(caretPosEnd.value + 1)

	// Wrap the current word in a nowrap span.
	// This is to prevent the caret from line-breaking the word.
	let strWord = strCaret
	console.log(`-${strCaret}-`, strCaret == ' ')
	if (strCaret == ' ') {
		console.log(33)
		strWord = `<span class="caret${selClass}"> </span>`
	} else {
		const wordBefore = strBefore.split(' ').pop() ?? ''
		const wordAfter = strAfter.split(' ').shift() ?? ''

		if (wordBefore.length) {
			strBefore = strBefore.slice(0, -wordBefore.length)
		}
		if (wordAfter.length) {
			strAfter = strAfter.slice(wordAfter.length)
		}

		// console.log(wordBefore, strCaret, wordAfter)
		if (strCaret.includes(' ')) {
			const strCaretWords = strCaret.split(' ')
			const strCaretWordFirst = strCaretWords.shift()
			const strCaretWordFirstWrapped = strCaretWordFirst ? `<span class="caret sel">${strCaretWordFirst}</span>` : ''
			const strCaretWordLast = strCaretWords.pop()
			const strCaretWordLastWrapped = strCaretWordLast ? `<span class="caret sel">${strCaretWordLast}</span>` : ''
			let strCaretWordMiddle = strCaretWords.join(' ')
			strCaretWordMiddle = strCaretWordMiddle ? `<span class="caret sel"> ${strCaretWordMiddle} </span>` : '<span class="caret sel"> </span>'
			strWord = `<span class="nowrap">${wordBefore}${strCaretWordFirstWrapped}</span>${strCaretWordMiddle}<span class="nowrap">${strCaretWordLastWrapped}${wordAfter}</span>`
			console.log('>', `-${strCaretWordFirst}-`, `-${strCaretWordMiddle}-`, `-${strCaretWordLast}-`)
		} else {
			console.log(22)
			strCaret = `<span class="caret${selClass}">${strCaret}</span>`
			strWord = `<span class="nowrap"><span>${wordBefore}</span>${strCaret}<span>${wordAfter}</span></span>`
		}
	}

	// console.log(strBefore + '|' + strWord + '|' + strAfter)
	return `<span>${strBefore}</span>` + strWord + `<span>${strAfter}</span>`
})

/**
 * Methods
 */

function updateCaret(e: KeyboardEvent | MouseEvent | Event) {
	// console.log(11, 'updateCaret')
	const isCharacter = 'key' in e && e.key.length == 1
	const newCharLength = isCharacter ? 0 : 0

	// We delay caret measurement to make sure selectionEnd has been measured.
	// This takes around 90ms to update, so we wait 100ms.
	setTimeout(() => {
		caretPos.value = ($ip.value?.selectionStart ?? 0) + newCharLength
		caretPosEnd.value = $ip.value?.selectionEnd ?? 0 + newCharLength
	}, 1)
}

async function submitCommand() {
	output.value = ''
	const response = await mainApi?.execCommand(input.value)
	if (response.status != 200) {
		// console.error('Failed to execute command:', response.statusText)
		output.value = response.data
		return
	}
	output.value = response.data
	input.value = ''
}
</script>

<style lang="scss" scoped>
#cli {
	background: $black;
	color: $white-80;
	padding: 40px;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 1;
	font-family: 'IBM Plex Mono', monospace;
}

// Input text
#ip-display {
	color: $yellow;
	letter-spacing: normal;
}
#ip-display:deep() .nowrap {
	white-space: nowrap;
	// background: red;
	text-decoration: underline;
}
#ip-display:deep() .caret {
	display: inline-block;
	height: $line-height;
	line-height: $line-height;
	color: $black;
	animation: blink 1s infinite;
	white-space: pre;
	margin-right: -9px;
}
#ip-display:deep() .caret + span {
	margin-left: 9px;
}
#ip-display:deep() .caret.sel {
	animation: none;
	background: $yellow;
}
@keyframes blink {
	0% {
		background: $white-80;
		color: $black;
	}
	49% {
		background: $white-80;
		color: $black;
	}
	50% {
		background: none;
		color: inherit;
	}
	100% {
		background: none;
		color: inherit;
	}
}

#ip-wrap {
	position: relative;
}
// Hidden form
#ip-wrap form {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	opacity: 0.5;

	top: 100px;
	height: 100px;
	opacity: 1;
}
#cli-form button {
	border: none;
	background: none;
	opacity: 0;
	width: 20px;
	margin-right: -20px;
	pointer-events: none;
}
#cli-input {
	border: none;
	width: 100%;
	height: 100%;
	line-height: $line-height;
	font-family: 'IBM Plex Mono', monospace;
	font-size: $font-size;
	padding: 0;
	letter-spacing: normal;
	// caret-color: transparent;

	// background: #666;
	background: transparent;
	color: $yellow;
	caret-color: white;
}
#cli-input::-moz-selection {
	background: #ffdd00;
	color: $black;
}
#cli-input::selection {
	background: #ffdd00;
	color: $black;
}
#cli-input:focus {
	outline: none;
	// background: white;
}
</style>
