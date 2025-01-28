<script setup lang="ts">
// Vue
import { ref, watch, nextTick, onMounted } from 'vue'

// Components
import BaseIconButton from '@/components/BaseIconButton.vue'

// Type declarations
type ActionOption = {
	val: string
	disp: string
	action: () => void
	selected?: boolean
	hide?: boolean
}

// Properties
const props = defineProps<{
	options: ActionOption[]
	disabled?: boolean
}>()

// Definitions
const action = ref<string>('')
const enableWatcher = ref(false)

/**
 * Hooks
 */

onMounted(async () => {
	// If one of the options has selected set to True, set the value to this option.
	const selectedOption = props.options.find((option) => option.selected)
	if (selectedOption) {
		action.value = selectedOption.val
	}
	await nextTick()
	enableWatcher.value = true
})

watch(
	() => action.value,
	async (newVal) => {
		if (!enableWatcher.value) return
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

<!----------------------------------------------------->

<template>
	<div class="btn-wrap" :class="{ disabled }">
		<BaseIconButton icon="icn-overflow" />
		<select v-model="action">
			<option value="" disabled hidden></option>
			<option v-for="(option, i) in options" :key="i" :value="option.val" :hidden="!!option.hide">
				{{ option.disp }}
			</option>
		</select>
	</div>
</template>

<!----------------------------------------------------->

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
