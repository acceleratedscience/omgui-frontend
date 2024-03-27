<template>
	<div id="cli" ref="$cli">
		<IconButton icon="icn-close" @click="commandLineStore.setActive(false)" btnStyle="soft" />

		<pre v-for="(output, i) in commandLineStore.output" :key="i">{{ output }}</pre>

		<div v-if="commandLineStore.loading" class="loading">Loading...</div>
		<div id="ip-wrap">
			<div class="framer">{{ modelValue }}</div>
			<form id="cli-form" @submit.prevent="submit">
				<div class="prefix">%&nbsp;</div>
				<div class="blinking-cursor"></div>
				<textarea
					ref="$ip"
					:class="{ empty: !modelValue }"
					v-model="modelValue"
					@blur="$ip?.focus()"
					@keydown="commandLineStore.onKeyDown"
				></textarea>
				<button type="submit"></button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, computed, nextTick } from 'vue'
import type { ComputedRef } from 'vue'

// Stores
import { useCommandLineStore } from '@/stores/CommandLineStore'
const commandLineStore = useCommandLineStore()

// Components
import IconButton from '@/components/IconButton.vue'

// Definitions
const $cli = ref<HTMLDivElement | null>(null)
const $ip = ref<HTMLInputElement | null>(null)

/**
 * Computed
 */

const modelValue = computed({
	get: () => commandLineStore.input,
	set: (value) => commandLineStore.setInput(value),
})

/**
 * Hooks
 */

onMounted(() => {
	$ip.value?.focus()
	commandLineStore.setCallback(scrollToBottom)
})

/**
 * Methods
 */

function submit() {
	console.log(1, 'submit', scrollToBottom)
	commandLineStore.submit(scrollToBottom)
}

async function scrollToBottom() {
	await nextTick()
	$cli.value?.scrollTo(0, $cli.value?.scrollHeight)
}
</script>

<style lang="scss" scoped>
// Frame
#cli {
	background: $black;
	color: $white-80;
	padding: 40px;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 20;
	font-family: 'IBM Plex Mono', monospace;
	overflow: auto;
}

// Close button
#cli .icn-btn.icn-close {
	color: $white-50;
	position: fixed;
	top: 20px;
	right: 20px;
}

/**
 * Input
 */

#ip-wrap {
	position: relative;
}

// Framer
// In order for the textarea box to expand with the content,
// we feed the text to the hidden framer div with exactly the
// same styles as the textarea, which in its turn will expand
// the parent ip-wrap div, which controls the textarea height.
#ip-wrap .framer {
	letter-spacing: normal;
	opacity: 0;
}

@keyframes cursor-blink {
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

// Input form
#ip-wrap form {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
}
#ip-wrap .framer:empty + form > .blinking-cursor {
	display: block;
	width: 8px;
	height: $line-height;
	animation: cursor-blink 1s infinite;
	background: $white-80;
}
#ip-wrap .framer:empty + form > .prefix {
	color: $yellow;
}
#cli-form textarea {
	border: none;
	width: 100%;
	height: 100%;
	line-height: $line-height;
	font-family: 'IBM Plex Mono', monospace;
	font-size: $font-size;
	// font-size: $font-size-small;
	padding: 0;
	letter-spacing: normal;
	background: transparent;
	color: $yellow;
	caret-color: white;
	resize: none;

	//
	// background: purple;
	// margin-top: 20px;
}
#cli-form textarea.empty {
	opacity: 0;
}
#cli-form textarea::-moz-selection {
	background: #ffdd00;
	color: $black;
}
#cli-form textarea::selection {
	background: #ffdd00;
	color: $black;
}
#cli-form textarea:focus {
	outline: none;
}
#cli-form button {
	border: none;
	background: none;
	opacity: 0;
	width: 20px;
	margin-right: -20px;
	pointer-events: none;
}

/**
 * Output
 */

#cli .loading,
#cli pre {
	padding-bottom: 16px;
	border-bottom: solid 1px rgba(255, 255, 255, 0.1);
	margin-bottom: 16px;
	white-space: pre-wrap;
	// font-size: $font-size-small;
}

/**
 * Hover
 */

@media (hover: hover) {
	// Close button
	#cli .icn-btn.icn-close:hover {
		color: white;
	}
}
</style>
