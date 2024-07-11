<template>
	<div id="cli" ref="$cli">
		<BaseIconButton icon="icn-close" @click="assistantStore.setActive(false)" btnStyle="soft" />

		<pre v-for="(output, i) in assistantStore.output" :key="i">{{ output }}</pre>

		<div v-if="assistantStore.loading" class="loading">Loading...</div>
		<div id="ip-wrap">
			<form id="cli-form" @submit.prevent="submit">
				<textarea
					ref="$ip"
					v-model="modelValue"
					:class="{ empty: !modelValue }"
					:rows="rows"
					@blur="$ip?.focus()"
					@keydown="assistantStore.onKeyDown"
				></textarea>
				<button type="submit"></button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, computed, nextTick } from 'vue'
import type { ComputedRef, WritableComputedRef } from 'vue'

// Stores
import { useAssistantStore } from '@/stores/AssistantStore'
const assistantStore = useAssistantStore()

// Components
import BaseIconButton from '@/components/BaseIconButton.vue'

// Definitions
const $cli = ref<HTMLDivElement | null>(null)
const $ip = ref<HTMLInputElement | null>(null)

/**
 * Computed
 */

const modelValue: WritableComputedRef<string> = computed({
	get: () => assistantStore.input,
	set: (value) => assistantStore.setInput(value),
})

const rows: ComputedRef<number> = computed(() => {
	return assistantStore.input.split('\n').length
})

/**
 * Hooks
 */

onMounted(() => {
	$ip.value?.focus()
	assistantStore.setCallback(scrollToBottom)
})

/**
 * Methods
 */

function submit() {
	console.log(1, 'submit', scrollToBottom)
	assistantStore.submit(scrollToBottom)
}

async function scrollToBottom() {
	await nextTick()
	$cli.value?.scrollTo(0, $cli.value?.scrollHeight)
}
</script>

<style lang="scss" scoped>
// Frame
#cli {
	background: #0e2248;
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

// Input form
#ip-wrap form {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 40px;
	display: flex;
	padding: 0 40px;
	// background: black;
}
#cli-form textarea {
	flex: 1;
	outline: none;
	border: none;
	border-radius: 2px;
	padding: 20px;
	font-family: $font-fam;
	font-size: $font-size;
	line-height: $line-height;
	resize: none;
}

#cli-form textarea::-moz-selection {
}
#cli-form textarea::selection {
}
#cli-form textarea:focus {
}
#cli-form button {
	width: 20px;
	height: 0;
	margin-right: -20px;
	right: 0;
	top: 0;
	border: none;
	opacity: 0;
	pointer-events: none;
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
