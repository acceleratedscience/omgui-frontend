<template>
	<div id="pages">
		<div class="btn" @click="prevPage"><SvgServe filename="icn-caret-left" /></div>
		<div class="btn" @click="nextPage"><SvgServe filename="icn-caret-right" /></div>
		<div class="display">
			<span>{{ props.modelValue }} / {{ props.total }}</span>
			<select
				:value="props.modelValue"
				@change="setPage(($event.target as HTMLSelectElement)?.value)"
			>
				<option v-for="page in props.total" :key="page" :value="page">
					{{ page }}
				</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import type { PropType } from 'vue'

// Components
import SvgServe from '@/components/SvgServe.vue'

// Emits
const emit = defineEmits(['update:modelValue'])

// Type declarations
type Props = {
	total: number
	modelValue: number
	max: number
}

// Props
const props = defineProps({
	total: {
		type: Number as PropType<Props['total']>,
		required: true,
	},
	modelValue: {
		type: Number as PropType<Props['modelValue']>,
		default: 1,
	},

	// Maximum number of pages to show.
	max: {
		type: Number as PropType<Props['max']>,
		default: 10,
	},
})

/**
 * Methods
 */

function prevPage() {
	if (props.modelValue > 1) {
		emit('update:modelValue', props.modelValue - 1)
	}
}

function nextPage() {
	if (props.modelValue < props.total) {
		emit('update:modelValue', props.modelValue + 1)
	}
}

function setPage(page: number | string | undefined) {
	if (!page) return
	page = typeof page == 'string' ? parseInt(page) : page
	emit('update:modelValue', page)
}
</script>

<style lang="scss" scoped>
#pages {
	height: 40px;
	display: flex;
	background: $soft-bg;
}
#pages .btn {
	width: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	// border-right: solid 1px $black-10;
}
#pages .btn.sel {
	background: $black;
	color: white;
}
#pages .display {
	line-height: 40px;
	padding: 0 16px;
	position: relative;
	white-space: nowrap;
}
#pages .display select {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	cursor: pointer;
}

/**
 * Hover
 */

@media (hover: hover) {
	#pages .btn:not(.sel):hover,
	#pages .display:hover {
		background: #e5e5e5;
	}
}
</style>
