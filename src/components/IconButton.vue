<template>
	<div
		id="icn-btn"
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

// Components
import SvgServe from '@/components/SvgServe.vue'

// Props
const props = defineProps({
	icon: {
		type: String,
		required: true,
	},
	colorOff: {
		type: String,
		default: 'rgba(0, 0, 0, 0.1)', // --black-10
	},
	colorOn: {
		type: String,
		default: '#393939', // --black, same as text color
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

<style lang="css" scoped>
#icn-btn {
	width: 40px;
	height: 40px;
	padding: 8px;
	cursor: pointer;
}
#icn-btn:deep() svg {
	fill: var(--color-off);
}
#icn-btn.on:deep() svg {
	fill: var(--color-on);
}

@media (hover: hover) {
	#icn-btn:not(.on):hover:deep() svg {
		fill: $black-30;
	}
	#icn-btn.on:hover:deep() svg {
		filter: brightness(80%);
	}
}
</style>
