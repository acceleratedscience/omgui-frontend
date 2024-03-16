<template>
	<div id="actions" ref="$actions">
		<!-- <cv-text-input hideLabel="true"></cv-text-input> -->

		<!-- Pagination -->
		<BasePagination
			v-if="molGridStore.pageTotal > 1"
			:modelValue="molGridStore.page"
			@update:modelValue="molGridStore.setPage"
			:total="molGridStore.pageTotal"
			:max="3"
		/>

		<!-- Search -->
		<MolSearch />

		<div class="filler-1"></div>
		<div class="filler-2"></div>

		<!-- Sort -->
		<cv-dropdown
			id="dd-sort"
			:class="{ default: !molGridStore.sort }"
			:modelValue="molGridStore.sort"
			@update:modelValue="molGridStore.setSort"
		>
			<cv-dropdown-item value="">&nbsp;</cv-dropdown-item>
			<cv-dropdown-item v-for="(item, i) in sortItems" :key="i" :value="item">
				{{ item }}
			</cv-dropdown-item>
			<cv-dropdown-item v-if="sortItems.length == 1" value="" disabled
				>(Activate properties to sort)</cv-dropdown-item
			>
		</cv-dropdown>

		<!-- Selection actions -->
		<cv-dropdown id="dd-select" v-model="selectedSelect" :key="forceSelectReload">
			<cv-dropdown-item value="default" hidden>
				<template v-if="molGridStore.sel.length > 0">
					({{ molGridStore.sel.length }}) selected
				</template>
				<template v-else>Select</template>
			</cv-dropdown-item>
			<cv-dropdown-item
				v-for="(selAction, i) in selectActions"
				:key="i"
				:value="selAction"
				:disabled="selAction == 'select matching' && !molGridStore.searchValue"
			>
				{{ selAction }}
			</cv-dropdown-item>
		</cv-dropdown>

		<!-- Main actions -->
		<cv-dropdown id="dd-actions" placeholder="Actions" :disabled="!molGridStore.sel.length">
			<cv-dropdown-item v-for="(action, i) in actions" :key="i" :value="action">
				{{ action }}
			</cv-dropdown-item>
		</cv-dropdown>

		<!-- Save -->
		<cv-button size="sm" :disabled="false">Save</cv-button>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, watch, nextTick } from 'vue'
import type { ComputedRef } from 'vue'

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
const molGridStore = useMolGridStore()

// Components
import BasePagination from '@/components/BasePagination.vue'
import MolSearch from '@/components/MolSearch.vue'

// Utils
import useStickyObserver from '@/utils/sticky-observer'

// Definitions
const $actions = ref<HTMLElement | null>(null)
const selectedSelect = ref<string>('default')
const selectActions = ['select all', 'deselect all', 'select matching', 'invert selection']
const actions = ['remove selected', 'keep selected', 'copy to clipboard', 'save SMILES', 'save CSV'] // prettier-ignore

/**
 * Computed
 */

const sortItems: ComputedRef<string[]> = computed(() => {
	return ['name'].concat(molGridStore.showProps)
})

// The selected ticker doesn't automnatically
// update when the selected items change.
const forceSelectReload: ComputedRef<string> = computed(() => {
	return molGridStore.sel.join('-')
})

/**
 * Logic
 */

useStickyObserver('#actions')

/**
 * Hooks
 */

// Selection dropdown
watch(selectedSelect, (newVal) => {
	dispatchSelect(newVal)
})

/**
 * Methods
 */

async function dispatchSelect(selectAction: string) {
	if (!molGridStore.mols || !selectAction) return
	if (selectAction == 'default') return
	if (selectAction == 'select all') {
		molGridStore.setSel([...Array(molGridStore.mols.length).keys()])
	} else if (selectAction == 'deselect all') {
		molGridStore.setSel([])
	} else if (selectAction == 'select matching') {
		// console.log('select matching')
	} else if (selectAction == 'invert selection') {
		const allIndices = [...Array(molGridStore.mols.length).keys()]
		const invertedSelection = allIndices.filter((i) => !molGridStore.sel.includes(i))
		molGridStore.setSel(invertedSelection)
	}

	// Reset so we can reuse
	// setTimeout(() => {
	// 	selectedSelect.value = 'deselect all'
	// }, 1)
	await nextTick()
	selectedSelect.value = 'default'
}
function dispatchAction(action: string) {
	if (action == 'remove selected') {
		// console.log('remove')
	} else if (action == 'keep selected') {
		// console.log('keep')
	} else if (action == 'copy to clipboard') {
		// console.log('copy to clipboard')
	} else if (action == 'save SMILES') {
		// console.log('save SMILES')
	} else if (action == 'save CSV') {
		// console.log('save CSV')
	}

	// console.log(action)
}
</script>

<style lang="scss" scoped>
// Actions
#actions {
	position: sticky;
	top: 0;
	left: -40px;
	right: -40px;
	z-index: 10;
	display: flex;
	flex-wrap: wrap;
	gap: 0 8px;
	padding-top: 8px;
}
#actions.sticky {
	box-shadow: 0 1px 0 0 $black-10;
	background: white;
}
#actions.sticky::before,
#actions.sticky::after {
	// To cover the focus border which
	// is 1px wider than the #settings.
	content: '';
	display: block;
	width: 1px;
	height: 100%;
	position: absolute;
	top: 0;
	background: white;
}
#actions.sticky::before {
	left: -1px;
}
#actions.sticky::after {
	right: -1px;
}
#actions:deep() > * {
	margin-bottom: 8px;
}

// Sort, select & actions
#dd-sort {
	flex: 250px 0 0;
}
#dd-sort:not(.default):deep() #dd-sort-value::before {
	content: 'Sort: ';
}
#dd-sort.default:deep() #dd-sort-value::before {
	content: 'Sort';
}
#dd-sort.default:deep() .cv-dropdown-item:first-child {
	display: none;
}
#dd-sort:not(.default):deep() .cv-dropdown-item:first-child > .bx--dropdown-link::before {
	content: 'Unsort';
}
#dd-actions,
#dd-select {
	flex: 150px 0 0;
}

/**
 * Responsive
 */
.filler-1,
.filler-2 {
	display: none;
}
#actions > .filler-1 {
	height: 0;
	line-height: 0;
	flex: 0 0 100%;
	background: pink;
	margin-bottom: 0;
	// border: solid 1px red;
}
.filler-2 {
	flex: 1 1 1px;
	min-width: 0;
	// background: red;
}
@media (max-width: $bp-large) {
	.filler-1,
	.filler-2 {
		display: block;
	}
}
@media (max-width: $bp-large) {
	.filler-2 {
		display: none;
	}
	#dd-sort,
	#dd-select,
	#dd-actions {
		flex: 1;
	}
}
@media (max-width: $bp-small) {
	#pages:deep() .display {
		display: none;
	}
}
</style>
