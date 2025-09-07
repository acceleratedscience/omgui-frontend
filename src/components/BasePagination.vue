<template>
	<div class="pagination" :class="{ disabled }">
		<div class="btn" @click="prevPage"><BaseIcon icon="icn-caret-left" /></div>
		<div class="btn" @click="nextPage"><BaseIcon icon="icn-caret-right" /></div>
		<div class="display">
			<span>{{ props.modelValue }} / {{ displayTotal }}</span>
			<select :value="props.modelValue" @change="setPage(($event.target as HTMLSelectElement)?.value)">
				<option v-if="dropdownPageNrs[0] > 1" value="before" disabled>...</option>
				<option v-for="page in dropdownPageNrs" :key="page" :value="page">
					{{ page }}
				</option>
				<option v-if="dropdownPageNrs[dropdownPageNrs.length - 1] < props.total" value="after" disabled>...</option>
			</select>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Components
import BaseIcon from '@/components/BaseIcon.vue'

// Utils
import { largeNr } from '@/utils/helpers'

// Emits
const emit = defineEmits(['update:modelValue'])

// Props
const props = withDefaults(
	defineProps<{
		total: number
		modelValue: number
		disabled?: boolean
	}>(),
	{
		modelValue: 1,
	},
)

/**
 * Computed
 */

// Elegantly display large numbers.
const displayTotal = computed(() => {
	return largeNr(props.total)
})

// We show max 200 pages in the dropdown, otherwise it gets too
// long when opening mega files, which slows down the browser.
const dropdownPageNrs = computed(() => {
	const range = 200
	const pages = []
	const start = Math.max(1, props.modelValue - range / 2)
	const end = Math.min(props.total, start + range)
	for (let i = start; i <= end; i++) {
		pages.push(i)
	}
	return pages
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
.pagination {
	height: 40px;
	display: flex;
	background: $soft-bg;
	user-select: none;
}
.pagination .btn {
	width: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	// border-right: solid 1px $black-10;
}
.pagination .btn.sel {
	background: $black;
	color: white;
}
.pagination .display {
	line-height: 40px;
	padding: 0 16px;
	position: relative;
	white-space: nowrap;
}
.pagination .display select {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	cursor: pointer;
}

// Disabled state
.pagination.disabled {
	pointer-events: none;
}
.pagination.disabled .btn {
	color: $black-30;
}

/**
 * Hover
 */

@media (hover: hover) {
	.pagination .btn:not(.sel):hover,
	.pagination .display:hover {
		background: $black-05;
	}
}
</style>
