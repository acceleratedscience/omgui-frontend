<template>
	<div class="btn-wrap" :class="{ disabled }">
		<BaseIconButton icon="icn-overflow" />
		<select v-model="action">
			<option value="" disabled hidden></option>
			<option v-for="(option, i) in options" :key="i" :value="option.val">{{ option.disp }}</option>
		</select>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, watch, nextTick } from 'vue'

// Components
import BaseIconButton from '@/components/BaseIconButton.vue'

// Type declarations
import type { ActionOption } from '@/types'

// Properties
const props = defineProps<{
	options: ActionOption[]
	disabled?: boolean
}>()

// Definitions
const action = ref<string>('')

/**
 * Hooks
 */

watch(
	() => action.value,
	async (newVal) => {
		if (newVal) {
			// Handle action
			const selectedOption = props.options.find((option) => option.val === newVal)
			if (selectedOption) {
				const action = selectedOption.action
				action()
			}
		}

		// Reset
		await nextTick()
		action.value = ''
	},
)
</script>

<style lang="scss" scoped>
.btn-wrap {
	height: 40px;
	position: relative;
}
.btn-wrap.disabled {
	pointer-events: none;
	opacity: 0.5;
}
.btn-wrap select {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	cursor: pointer;
}
select {
	text-align-last: right;
}

@media (hover: hover) {
	// Replicate the default BaseIconButton hover effect
	// which is disabled because of the dropdown overlay.
	.btn-wrap:hover .icn-btn {
		background: rgba(0, 0, 0, 0.05);
	}
}
</style>
