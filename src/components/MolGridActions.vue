<template>
	<div id="actions">
		<!-- ref="$actions" -->
		<!-- <cv-text-input hideLabel="true"></cv-text-input> -->

		<!-- Search -->
		<MolSearch />

		<!-- Pagination -->
		<BasePagination v-model="vmodelPagination" :total="molGridStore.pageTotal" :max="3" :disabled="molGridStore.pageTotal == 1" />

		<div class="breaker-1"></div>
		<div class="filler"></div>

		<!-- Sort -->
		<SortDropdown id="dd-sort" v-model="vmodelSort" :items="sortItems" :disabledItems="disabledSortItems" />

		<!-- Selection actions -->
		<cv-dropdown id="dd-select" v-model="selectActionsSelect" :key="forceSelectReload">
			<cv-dropdown-item value="default" hidden>
				<template v-if="molGridStore.hasSel"> ({{ molGridStore.sel.length }}) selected </template>
				<template v-else>Select</template>
			</cv-dropdown-item>
			<cv-dropdown-item
				v-for="(selAction, i) in selectActions"
				:key="i"
				:value="selAction"
				:disabled="selAction == 'select matching' && !molGridStore.searchStr"
			>
				{{ selAction }}
			</cv-dropdown-item>
		</cv-dropdown>

		<div class="breaker-2"></div>

		<!-- Main actions -->
		<cv-dropdown id="dd-actions" v-model="mainActionsSelect" :disabled="!molGridStore.hasSel" @change="dispatchMainAction">
			<cv-dropdown-item value="default" hidden>Actions</cv-dropdown-item>
			<cv-dropdown-item v-for="(action, i) in mainActions" :key="i" :value="action">
				{{ action }}
			</cv-dropdown-item>
		</cv-dropdown>

		<!-- Save -->
		<ButtonSave :onSave="molGridStore.saveChanges" :disabled="!molGridStore.hasChanges" />
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, watch, nextTick } from 'vue'
import type { ComputedRef, WritableComputedRef } from 'vue'

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
const molGridStore = useMolGridStore()

// Components
import BasePagination from '@/components/BasePagination.vue'
import MolSearch from '@/components/MolSearch.vue'
import SortDropdown from '@/components/SortDropdown.vue'
import ButtonSave from '@/components/ButtonSave.vue'

// Utils
import useStickyObserver from '@/utils/sticky-observer'

// Definitions
// const $actions = ref<HTMLElement | null>(null)
const selectActionsSelect = ref<string>('default')
const selectActions = ['select all', 'deselect all', 'select matching', 'invert selection']
const mainActionsSelect = ref<string>('default')
const mainActions = ['remove selected', 'keep selected', 'copy to clipboard', 'save SMILES', 'save CSV'] // prettier-ignore

/**
 * Computed
 */

const sortItems: ComputedRef<string[]> = computed(() => {
	return ['name'].concat(molGridStore.showProps)
})
const disabledSortItems: ComputedRef<string[]> = computed(() => {
	return sortItems.value.length <= 2 ? ['activate properties to sort'] : []
})

// The selected ticker doesn't automnatically
// update when the selected items change.
const forceSelectReload: ComputedRef<string> = computed(() => {
	return molGridStore.sel.join('-')
})

// Model value for the sort dropdown.
const vmodelSort: WritableComputedRef<string> = computed({
	get: () => molGridStore.sort,
	set: (newValue) => molGridStore.setSort(newValue),
})

// Model value for the pagination component.
const vmodelPagination: WritableComputedRef<number> = computed({
	get: () => molGridStore.page,
	set: molGridStore.setPage,
})

/**
 * Logic
 */

useStickyObserver('#actions')

/**
 * Hooks
 */

// Selection dropdown
watch(selectActionsSelect, (newVal) => {
	dispatchSelect(newVal)
})

/**
 * Methods
 */

async function dispatchSelect(selectAction: string) {
	if (!molGridStore.mols || !selectAction) return
	if (selectAction == 'default') return
	if (selectAction == 'select all') {
		molGridStore.setSel([...Array(molGridStore.total).keys()])
	} else if (selectAction == 'deselect all') {
		molGridStore.setSel([])
	} else if (selectAction == 'select matching') {
		molGridStore.setSel(molGridStore.matching)
	} else if (selectAction == 'invert selection') {
		const allIndices = [...Array(molGridStore.total).keys()]
		const invertedSelection = allIndices.filter((i) => !molGridStore.sel.includes(i))
		molGridStore.setSel(invertedSelection)
	}

	// Reset for next use.
	await nextTick()
	selectActionsSelect.value = 'default'
}
async function dispatchMainAction(action: string) {
	if (action == 'remove selected') {
		molGridStore.removeMols(molGridStore.sel)
	} else if (action == 'keep selected') {
		molGridStore.keepMols(molGridStore.sel)
	} else if (action == 'copy to clipboard') {
		// console.log('copy to clipboard')
	} else if (action == 'save SMILES') {
		// console.log('save SMILES')
	} else if (action == 'save CSV') {
		// console.log('save CSV')
	}

	// Reset for next use.
	await nextTick()
	mainActionsSelect.value = 'default'
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
#dd-sort,
#dd-actions,
#dd-select {
	flex: 150px 0 0;
}

/**
 * Responsive
 */

// Note: filler is not used, but may be useful in the future.
.breaker-1,
.breaker-2,
.filler {
	display: none;
}
#actions .breaker-1,
#actions .breaker-2 {
	height: 0;
	line-height: 0;
	flex: 0 0 100%;
	margin-bottom: 0;
	// border: solid 1px blue;
}
.filler {
	flex: 1 1 1px;
	min-width: 0;
	background: purple;
}

@media (max-width: $bp-large) {
	.breaker-1 {
		display: block;
	}
	#dd-sort,
	#dd-select,
	#dd-actions {
		flex: 1;
	}
}
@media (max-width: $bp-medium) {
	.breaker-1 {
		display: block;
	}
}
@media (max-width: 630px) {
	.breaker-2 {
		display: block;
	}
}
@media (max-width: $bp-small) {
	.pagination:deep() .display {
		display: none;
	}
}
</style>
