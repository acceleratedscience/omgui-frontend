<template>
	<cv-button
		v-if="showButton"
		size="small"
		kind="secondary"
		class="btn-enrich"
		:class="{ enriching }"
		:disabled="enriching"
		title="Calculate molecular properties and load data from PubChem"
		@click="enrichMol"
	></cv-button>
	<!-- && !mol.identifiers?.cid -->
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue'

// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const molViewerStore = useMolViewerStore()
const molGridStore = useMolGridStore()

// Type declarations
import type { ComputedRef } from 'vue'

// Definitions
const enriching = ref<boolean>(false)

/**
 * Computed
 */

const showButton: ComputedRef<boolean> = computed(() => {
	if (!molViewerStore.enriched) return true
	return false
})

/*
 * Methods
 */

async function enrichMol() {
	enriching.value = true
	const success = await molViewerStore.enrichMol()
	if (success) {
		// If the molecule is from a molset, we mark the molset as changed.
		// This will trigger the onBeforeExit modal.
		if (molViewerStore.molFromMolset) {
			molGridStore.setHasChanges(true)
		}
	}
	enriching.value = false
}
</script>

<style lang="scss" scoped>
.btn-enrich {
	width: 120px;
}
.btn-enrich::before {
	content: 'Enrich';
}
.btn-enrich.enriching {
	pointer-events: none;
}
.btn-enrich.enriching::before {
	content: 'Enriching';
}
.btn-enrich.enriching::after {
	content: '';
	animation: ellipsis 800ms infinite;
}
</style>
