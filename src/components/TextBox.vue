<template>
	<pre
		ref="$textContent"
		class="text-box"
	><template v-for="lineWrap, i in textDataLines" :key="i"><div v-for="line, j in lineWrap" :key="j" :class="{'new-line': j === 0}">{{ line }}</div></template></pre>
</template>

<script setup lang="ts">
// Vue
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Stores
import { useMainStore } from '@/stores/MainStore'
const mainStore = useMainStore()

// Props
const props = defineProps<{
	textData: string
}>()

// Definitions
const $textContent = ref<HTMLElement | null>(null)
const availChars = ref<number>(0)
const { screenWidth } = storeToRefs(mainStore)

/**
 * Computed
 */

// Text data split up into an array of lines trimmed to the width of our text box.
// This is needed to add our line numbers with CSS.
const textDataLines = computed<string[]>(() => {
	if (!props.textData) return []
	let ogLines = String(props.textData).split('\n')
	if (!availChars.value) return ogLines

	// Split lines that would wrap into multiple individual lines.
	const splitLines = new Array()
	ogLines.forEach((ogLine: string) => {
		let firstLine = true
		splitLines.push([])
		while (ogLine.length > availChars.value) {
			let line = ogLine.slice(0, availChars.value + 1) // We add one character in case the next character is a whitespace.
			let splitIndex = availChars.value

			// Reduce length of slice to the last available space
			if (line[line.length - 1] == ' ') {
				line = line.slice(0, line.length - 1)
			} else {
				let whitespaces = [...line.matchAll(/\s/g)]
				let lastWhiteSpaceIndex = whitespaces.length > 0 ? whitespaces[whitespaces.length - 1].index : -1
				if (lastWhiteSpaceIndex && lastWhiteSpaceIndex > 0) splitIndex = lastWhiteSpaceIndex
				line = line.slice(0, splitIndex)
			}
			splitLines[splitLines.length - 1].push(line)
			if (firstLine) firstLine = false

			// Remove the part of the line we just added to splitLines.
			ogLine = ogLine.slice(splitIndex + 1) // + 1 to trim off the whitespace
		}
		splitLines[splitLines.length - 1].push(ogLine)
	})
	return splitLines
})

/**
 * Methods
 */

// Count how many monospace characters can fit on one line.
function countAvailChars() {
	if (!$textContent.value) return 0

	// Create a hidden clone of our text field.
	const textClone = $textContent.value.cloneNode(true) as HTMLElement
	textClone.innerHTML = ''
	textClone.style.width = $textContent.value.offsetWidth + 'px'
	textClone.style.position = 'absolute'
	textClone.style.top = '-1000px'
	textClone.style.opacity = '0'
	const div = document.createElement('div')
	const span = document.createElement('span')
	div.appendChild(span)
	textClone.appendChild(div)
	document.body.appendChild(textClone)

	// Copy attributes so Vue's scoped CSS applies.
	const originalDiv = $textContent.value.children[0]
	if (originalDiv) {
		originalDiv.getAttributeNames().forEach((attr) => {
			div.setAttribute(attr, originalDiv.getAttribute(attr)!)
		})
	}

	// Fill our clone with characters to figure out how many can fit.
	let count = 0
	const reservedWidth = 91 // The space reserved for the line number and padding, as defined in the CSS below: 40 + 10 + 20 + 1 + 20
	while (span.offsetWidth + reservedWidth < $textContent.value.offsetWidth) {
		span.innerText += 'm'
		count++
	}

	// Remove our clone from the DOM.
	document.body.removeChild(textClone)

	// Return the number of characters that can fit in the div.
	// We subtract 1 because the loop adds an extra character.
	availChars.value = count - 1
}

/**
 * Hooks
 */

onMounted(() => countAvailChars())

watch(
	() => props.textData,
	() => countAvailChars(),
)

watch(screenWidth, () => countAvailChars())
</script>

<style lang="scss" scoped>
.text-box {
	white-space: pre-wrap;
	font-size: $font-size-small;
	border: solid 1px $black-10;
	background: $extra-soft-bg;
}
.text-box {
	counter-reset: line-nr;
}
.text-box div:before {
	content: ' ';
	display: inline-block;
	width: 40px;
	border-right: 1px solid $black-10;
	padding: 0 5px;
	margin-right: 20px;
	text-align: right;
	color: $black-30;
}
.text-box div {
	counter-increment: line-nr 0;
}
.text-box div.new-line {
	counter-increment: line-nr 1;
}
.text-box div.new-line::before {
	content: counter(line-nr);
}
// .text-box div:nth-child(odd) {
// 	background: rgba(0, 0, 0, 0.03);
// }
.text-box div:first-child:before {
	padding-top: 10px;
}
.text-box div:last-child:before {
	padding-bottom: 10px;
}
</style>
