<template>
	<cv-button
		ref="$btn"
		size="sm"
		@click="onClick"
		:disabled="props.disabled && !complete"
		:class="{ loading, complete }"
		:style="styleButton"
		:icon="complete ? CheckmarkFilled : null"
		>{{ text }}</cv-button
	>
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue'

// Components
// @ts-ignore
import CheckmarkFilled from '@carbon/icons-vue/es/checkmark--filled/16'

// Type declarations
import type { ComponentPublicInstance } from 'vue'

// Definitions
const text = ref<string>('Save')
const loading = ref<boolean>(false)
const complete = ref<boolean>(false)
const $btn = ref<ComponentPublicInstance | null>(null)
const fixWidth = ref<number | null>(null)

// Emits
const emit = defineEmits(['update:modelValue', 'save'])

// Props
const props = withDefaults(
	defineProps<{
		disabled?: boolean
		onSave: () => Promise<boolean>
	}>(),
	{
		disabled: false,
	},
)

/**
 * Computed
 */

const styleButton = computed(() => {
	return fixWidth.value
		? {
				width: fixWidth.value + 'px',
			}
		: {}
})

/**
 * Methods
 */

//  emit('click', $event)

async function onClick() {
	loading.value = true
	// loading.value = !loading.value
	fixWidth.value = $btn.value?.$el?.offsetWidth ?? null
	const success: boolean = await props.onSave()
	if (success) {
		complete.value = true
		setTimeout(() => {
			complete.value = false
		}, 2000)
	}
	loading.value = false
}
</script>

<style lang="scss" scoped>
.bx--btn.loading::after {
	content: '';
	animation: ellipsis 800ms infinite;
}
.bx--btn.loading {
	/* transform: scale(0.8);*/
	animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
}
.bx--btn.complete {
	background-color: $success;
	color: white;
}
@keyframes shake {
	0% {
		transform: scale(0.97) translate(0.5px, 0.5px) rotate(0deg);
	}
	10% {
		transform: scale(0.95) translate(-0.5px, -1px) rotate(-0.5deg);
	}
	20% {
		transform: scale(0.95) translate(-1.5px, 0px) rotate(0.5deg);
	}
	30% {
		transform: scale(0.95) translate(1.5px, 1px) rotate(0deg);
	}
	40% {
		transform: scale(0.95) translate(0.5px, -0.5px) rotate(0.5deg);
	}
	50% {
		transform: scale(0.95) translate(-0.5px, 1px) rotate(-0.5deg);
	}
	60% {
		transform: scale(0.95) translate(-1.5px, 0.5px) rotate(0deg);
	}
	70% {
		transform: scale(0.95) translate(1.5px, 0.5px) rotate(-0.5deg);
	}
	80% {
		transform: scale(0.95) translate(-0.5px, -0.5px) rotate(0.5deg);
	}
	90% {
		transform: scale(0.95) translate(0.5px, 1px) rotate(0deg);
	}
	100% {
		transform: scale(0.95) translate(0.5px, -1px) rotate(-0.5deg);
	}
}
</style>
