<!-- 
	The molviewer can be loaded in three different contexts:
	- When opening a molecule file: /~/dopamine.smol.json -> ViewerDispatch.vue
	- Looking up a molecule by identifier: /mol/dopamine -> MolPage.vue -> MolFromIdentifier.vue
	- When opening a molecule from a molset: /mol/~/some_molset.molset.json?index=3 -> MolsetViewer.vue -> MolGrid.vue

	The context of the molviewer is accesible through the context prop.
 -->

<template>
	<!-- 
		When testing, make sure to always test the different context,
		going back and forth between the same and different contexts.
		The following links help with that.
	 -->
	<!-- <div style="display: flex; gap: 20px; margin-bottom: 50px">
		<router-link to="/~/_for_testing/mol_a.smol.json">context: file A</router-link>
		<router-link to="/~/_for_testing/mol_b.smol.json">context: file B</router-link>
		<router-link to="/mol/penguinone">context: identifier A</router-link>
		<router-link to="/mol/serotonin">context: identifier B</router-link>
		<router-link to="/~/_for_testing/molset_a.molset.json?show=1">context: molset A</router-link>
		<router-link to="/~/_for_testing/molset_b.molset.json?show=3">context: molset B</router-link>
	</div> -->

	<!-- Visualization -->
	<div id="mol-render" :class="{ headless: mainStore.headless }">
		<MolViewerVizSmol v-if="molType == 'smol'" />
		<MolViewerVizMmol v-else-if="molType == 'mmol'" />
	</div>

	<!-- Page content -->
	<div id="content-wrap">
		<!-- Left main column -->
		<div class="col-left">
			<BreadCrumbsNot v-if="context == 'identifier'" :backto="{ name: 'mol' }">
				<BaseIconButton icon="icn-file-json" iconHover="icn-file-json-hover" btnStyle="soft" mini @click="router.push('?use=json')" />
			</BreadCrumbsNot>
			<BreadCrumbs v-else :pathArray="pathArray">
				<BaseIconButton icon="icn-file-json" iconHover="icn-file-json-hover" btnStyle="soft" mini @click="router.push('?use=json')" />
			</BreadCrumbs>

			<!-- Title -->
			<MolViewerTitle :context="context" :loading="loading" />

			<!-- Molecule data -->
			<MolViewerDataSmol v-if="molType == 'smol'" :loading="loading" :loadingError="loadingError" @retryLoad="$emit('retryLoad')" />
			<MolViewerDataMmol v-else-if="molType == 'mmol'" />
		</div>

		<!-- Right column (to be enabled later) - See #enableright below -->
		<div v-if="!loading && false" class="col-right">
			<h4>Notes</h4>
			<textarea id="ip-notes"></textarea>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { onBeforeUnmount, computed } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useFileStore } from '@/stores/FileStore'
import { useMolGridStore } from '@/stores/MolGridStore'
import { useModalStore } from '@/stores/ModalStore'
const mainStore = useMainStore()
const molViewerStore = useMolViewerStore()
const fileStore = useFileStore()
const molGridStore = useMolGridStore()
const modalStore = useModalStore()

// Components
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import BreadCrumbsNot from '@/components/BreadCrumbsNot.vue'
import BaseIconButton from '@/components/BaseIconButton.vue'
import MolViewerVizSmol from '@/components/MolViewerVizSmol.vue'
import MolViewerVizMmol from '@/components/MolViewerVizMmol.vue'
import MolViewerTitle from '@/components/MolViewerTitle.vue'
import MolViewerDataSmol from '@/components/MolViewerDataSmol.vue'
import MolViewerDataMmol from '@/components/MolViewerDataMmol.vue'

// Type declarations
import type { MolType, Smol } from '@/types'
import type { ComputedRef } from 'vue'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// Emits
defineEmits(['retryLoad'])

// Props
const props = withDefaults(
	defineProps<{
		context?: 'file' | 'identifier' | 'molset' // See note on top of the file.
		loading?: boolean
		loadingError?: string
	}>(),
	{
		context: 'file',
	},
)

/**
 * Computed
 */

const molType: ComputedRef<MolType> = computed(() => {
	return molViewerStore.molType
})

// Path array for breadcrumbs
const pathArray: ComputedRef<string[]> = computed(() => {
	return props.context == 'molset'
		? fileStore.breadCrumbPathArray.concat(['mol #' + molViewerStore.molFromMolsetIndex?.toString()])
		: fileStore.breadCrumbPathArray
})

/**
 * Logic
 */

// Note: When opening molecule files, the data is loaded from
// within ViewerDispatch.vue -> molViewerStore.setMolData()

// When viewing molecule as JSON, and then returning to the molviewer,
// we need to reload the data.
if (molViewerStore.isEmpty && fileStore.data && fileStore.moduleName == 'MolViewer') {
	const data: Smol = fileStore.data
	molViewerStore.setMolData(data, 'smol')
}

// When opening a molecule from a molset, the fetchSmolVizData is called from within MolsetViewer.vue.
if (props.context == 'file' || props.context == 'identifier') {
	if (molViewerStore.inchi) {
		// When opening a molecule file.
		molViewerStore.fetchSmolVizData(molViewerStore.inchi)
	} else if (molViewerStore.smiles) {
		// When opening a molecule file.
		molViewerStore.fetchSmolVizData(molViewerStore.smiles)
	}
}

/**
 * Hooks
 */

// Clear store on exit.
onBeforeUnmount(molViewerStore.clear)

// Block any exit attempt when there are unsaved changes.
window.onbeforeunload = function () {
	if (molGridStore.hasChanges) return true
	molGridStore.clear()
}
onBeforeRouteLeave(onBeforeExit)
onBeforeRouteUpdate(onBeforeExit)

/**
 * Methods
 */

// Block route change when there are unsaved changes.
async function onBeforeExit(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
	// console.log('onBeforeExit MOL', molViewerStore.hasChanges)
	if (molViewerStore.molFromMolset) {
		// When we're looking at a molecule from a molset, we don't
		// do anything because MolSetViewer has its own onBeforeExit.
		// When you enrich or edit a molecule, saving it will update
		// the molset (either json or my-mols) which is all controlled
		// from TheButtonSaveMol.vue.
		next()
	} else if (molViewerStore.hasChanges) {
		await modalStore.alert('If you leave, all changes to this molecule will be lost.', {
			title: 'Unsaved molecule changes',
			primaryBtn: 'Stay',
			secondaryBtn: 'Discard',
			onCancel: () => {
				// We check for fullPath to include page changes.
				if (to.fullPath != from.fullPath) molViewerStore.clear()
				next()
			},
			onSubmit: () => next(false),
		})
	} else {
		// We check for path to exclude page changes.
		// Otherwise there's an ungly flicker when changing pages.
		if (to.path != from.path) molViewerStore.clear()
		next()
	}
}
</script>

<style lang="scss" scoped>
/**
 * Layout
 */

#content-wrap {
	display: flex;
	gap: 0 40px;
	margin-bottom: 64px;
}
#content-wrap .col-left {
	flex: 1 1;
	max-width: 100%;
	// max-width: calc(100% - 290px); // Enable this line to enable the right column. #enableright
}
#content-wrap .col-right {
	flex: 0 0 250px;
	background: fafafa;
}

/**
 * Visualization
 */

#mol-render {
	width: calc(100% + 32px);
	height: 300px;
	margin: -16px;
	margin-bottom: 40px;
	box-sizing: border-box;
	display: flex;
	gap: 4px;
	grid-column-start: 1;
	grid-column-end: 12;
}
#mol-render.headless {
	margin-bottom: 20px;
}
#mol-render:deep() > div:not(.fullscreen) {
	flex: 1;
	height: 100%;
	position: relative;
	max-height: 100%;
	border-radius: 3px;
	overflow: hidden;
}

/**
 * Right Column
 */

#ip-notes {
	width: 100%;
	height: 200px;
	padding: 8px;
	box-sizing: border-box;
	border: solid 1px $black-10;
	border-radius: 3px;
	background: $soft-bg;
}

/**
 * Responsive
 */

@media (max-width: $bp-medium) {
	#content-wrap {
		flex-direction: column;
		gap: 40px 0;
	}
	#content-wrap .col-left {
		max-width: none;
	}
}
</style>
