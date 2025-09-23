<template>
	<BaseFetching v-if="loading" />
	<template v-else>
		<template v-if="!molViewerStore.molFromMolset">
			<h3><BaseIcon icon="icn-bookmark-full" />Molecule Working Set</h3>
			<p v-if="loadingError" class="error-msg">Something went wrong</p>
			<template v-else>
				<template v-if="empty">
					<p>You haven't saved any molecules yet.</p>
					<p>To add molecules to your working set, click the <BaseIcon icon="icn-bookmark" style="margin-bottom: -4px" /> bookmark icon on a molecule, or run:</p>
					<code class="block">
						import omgui<br>
						<br>
						omgui.add_mol(&lt;identifier&gt;)
					</code>
				</template>
				<div v-else id="about-msg">
					This is your working set of molecules, it is cleared at the end of your session.<br />
					If you want to preserve this molecule set, you can save it to your workspace under actions.
				</div>
			</template>
		</template>
		<MolsetViewer v-if="!empty && !loadingError" />
	</template>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue'

// API
import { apiFetch, moleculesApi } from '@/api'

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
const molGridStore = useMolGridStore()
const molViewerStore = useMolViewerStore()

// Components
import MolsetViewer from '@/viewers/MolsetViewer.vue'
import BaseFetching from '@/components/BaseFetching.vue'
import BaseIcon from '@/components/BaseIcon.vue'

// Definitions
const loading = ref<boolean>(true)
const loadingError = ref<string>('')
const status = ref<number | null>(null)
const empty = ref<boolean>(false)

/**
 * Hooks
 */

onMounted(() => {
	const query = molGridStore._setUrlQuery()
	apiFetch(moleculesApi.getMolset_mws(query), {
		onSuccess: (data) => {
			console.log(data)
			if (!data) {
				empty.value = true
			} else {
				molGridStore.setMolset(data)
				molGridStore.setContext('mws')
			}
		},
		onError: (err) => {
			console.log('Error in getMyMols()', err)
		},
		loading: loading,
		status: status,
		loadingError: loadingError,
	})
})
</script>

<style lang="css" scoped>
h3 svg {
	margin-right: 8px;
	/* background: pink; */
	position: relative;
	top: 2px;
}
#about-msg {
	margin-bottom: 16px;
}
code.block {
	margin-top: 20px;
	max-width: 400px;
}
</style>
