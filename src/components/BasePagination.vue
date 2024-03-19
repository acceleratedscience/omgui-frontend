<template>
	<div id="pages" :class="{ disabled }">
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
// Components
import SvgServe from '@/components/SvgServe.vue'

// Emits
const emit = defineEmits(['update:modelValue'])

// Props
const props = withDefaults(
	defineProps<{
		total: number
		modelValue: number
		max?: number
		disabled?: boolean
	}>(),
	{
		modelValue: 1,
		max: 10,
	},
)

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
	console.log(999, 'setPage!', 999)
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

// Disabled state
#pages.disabled {
	pointer-events: none;
}
#pages.disabled .btn {
	color: $black-30;
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
