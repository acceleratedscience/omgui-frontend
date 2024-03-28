<template>
	<div class="sort-wrap">
		<!-- +{{ sortKey }}+ / +{{ sortKeyNeutral }}+ / blank:{{ isBlank }} -->
		<!-- {{ items }} -->
		<div class="sort-direction" @click="reverseSort">{{ sortReversed ? '&uarr;' : '&darr;' }}</div>
		<cv-dropdown v-model="sortKeyNeutral" class="dd-sort" :class="{ blank: isBlank }">
			<cv-dropdown-item value="">&nbsp;</cv-dropdown-item>
			<cv-dropdown-item v-for="(item, i) in items" :key="i" :value="item">
				{{ item }}
			</cv-dropdown-item>
			<!-- When sort is set to index, index needs to be in the items
				or the carbon dropdown will display 'Choose an option'  -->
			<cv-dropdown-item :value="props.default" hidden>&nbsp;</cv-dropdown-item>
			<cv-dropdown-item v-for="(item, i) in disabledItems" :key="i" :value="item" disabled>{{ item }}</cv-dropdown-item>
		</cv-dropdown>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, watch, computed } from 'vue'
import type { ModelRef, ComputedRef, WritableComputedRef } from 'vue'

// Props
const props = withDefaults(
	defineProps<{
		items: string[]
		disabledItems: string[]
		default?: string // The default sort key
	}>(),
	{
		default: 'index',
	},
)

// Definitions
const sortKey: ModelRef<string | undefined> = defineModel()

/**
 * Computed
 */

const sortReversed: ComputedRef<boolean> = computed(() => {
	return !!sortKey.value && sortKey.value[0] === '-'
})

// Sort key without direction.
const sortKeyNeutral: WritableComputedRef<string> = computed({
	get: () => sortKey.value?.replace(/^-/, '') || '',
	set: (newValue) => {
		if (newValue != sortKey.value?.replace(/^-/, '')) {
			console.log('set')
			sortKey.value = newValue
		}
	},
})

const isBlank: ComputedRef<boolean> = computed(() => {
	return !sortKey.value || ['index', '-index'].includes(sortKey.value)
})

/**
 * Hooks
 */

/**
 * Methods
 */

function reverseSort() {
	// console.log('reverseSort')
	if (sortKey.value == `-${props.default}`) {
		sortKey.value = ''
	} else if (sortKey.value) {
		sortKey.value = sortKey.value[0] === '-' ? sortKey.value.slice(1) : `-${sortKey.value}`
	} else {
		sortKey.value = `-${props.default}`
	}
}
</script>

<style lang="scss" scoped>
// Wrap
.sort-wrap {
	// border: solid 1px red;
	position: relative;
}

// Sort direction
.sort-direction {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	z-index: 1;
	width: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	user-select: none;
	// background: rgba(255, 0, 0, 0.1);
	// display: none;
}

// Sort dropdown
.dd-sort {
	flex: 1 1 auto;
}
.dd-sort:not(.blank):deep() .bx--list-box__label::before {
	content: 'Sort: ';
}
.dd-sort.blank:deep() .bx--list-box__label::before {
	content: 'Sort';
}
.dd-sort.blank:deep() .cv-dropdown-item:first-child {
	// Hide unsort option whne there's no sort
	display: none;
}
.dd-sort:not(.blank):deep() .cv-dropdown-item:first-child > .bx--dropdown-link::before {
	content: 'unsort';
}
.dd-sort:deep() .bx--list-box__field {
	padding-left: 37px;
	// background: pink;
}
// .dd-sort:deep() .bx--list-box__label {
// 	// Truncate
// 	white-space: nowrap;
// 	text-overflow: ellipsis;
// 	overflow: hidden;
// }

@media (hover: hover) {
	.sort-direction:hover {
		background: $black-05;
	}
}
</style>
