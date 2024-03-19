<template>
	<div
		class="icn-btn"
		:class="{ on: toggleState }"
		@click="toggle"
		:style="{ '--color-off': colorOff, '--color-on': colorOn }"
	>
		<SvgServe :filename="props.icon" size="large" />
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue'
import type { PropType } from 'vue'

// Components
import SvgServe from '@/components/SvgServe.vue'

// Type declarations
type Props = {
	icon: string
	colorOff: string
	colorOn: string
}

// Props
const props = defineProps({
	icon: {
		type: String as PropType<Props['icon']>,
		required: true,
	},
	colorOff: {
		type: String as PropType<Props['colorOff']>,
		default: 'rgba(0, 0, 0, 0.1)', // $black-10
	},
	colorOn: {
		type: String as PropType<Props['colorOn']>,
		default: '#393939', // $black, same as text color
	},
})

// Definitions
const toggleState = ref(false)

/**
 * Methods
 */

function toggle() {
	toggleState.value = !toggleState.value
}
</script>

<style lang="scss" scoped>
.icn-btn {
	width: 40px;
	height: 40px;
	padding: 8px;
	cursor: pointer;
}
.icn-btn:deep() svg {
	fill: var(--color-off);
}
.icn-btn.on:deep() svg {
	fill: var(--color-on);
}

@media (hover: hover) {
	.icn-btn:not(.on):hover:deep() svg {
		fill: $black-30;
	}
	.icn-btn.on:hover:deep() svg {
		filter: brightness(80%);
	}
}
</style>
