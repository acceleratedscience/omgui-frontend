<template>
	<div id="title-wrap">
		<div class="v-align">
			<BaseSvgServe class="icn-mol" :class="{ loading: loading }" :icon="molIcon" size="large" />
		</div>
		<h2 id="data-name" data-val="{{ molName }}" :class="{ loading: loading }">
			{{ capitalize(molName) }}
		</h2>
		<div class="filler"></div>
		<BaseBookmark v-if="molViewerStore.isSmol && molViewerStore.mol" :mol="molViewerStore.mol" />
		<OverflowMenuMol :disabled="Boolean(loading)" />
		<BasePagination v-if="context == 'molset'" v-model="modelPagination" :total="molGridStore.total" />
		<BaseIconButton
			v-if="context == 'molset'"
			icon="icn-close"
			icnSize="small"
			btnStyle="carbon"
			@click="molViewerStore.setMolFromMolsetIndex(null)"
		/>
		<BaseIconButton
			v-else
			icon="icn-close"
			icnSize="small"
			btnStyle="default"
			@click="context == 'file' ? fileStore.exitViewer() : context == 'identifier' ? router.push({ name: 'mol' }) : null"
			:style="{ 'margin-right': '-8px' }"
		/>
	</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Stores
import { useFileStore } from '@/stores/FileStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const fileStore = useFileStore()
const molViewerStore = useMolViewerStore()
const molGridStore = useMolGridStore()

// Components
import OverflowMenuMol from '@/components/OverflowMenuMol.vue'
import BaseBookmark from '@/components/BaseBookmark.vue'
import BasePagination from '@/components/BasePagination.vue'
import BaseIconButton from '@/components/BaseIconButton.vue'
import BaseSvgServe from '@/components/BaseSvgServe.vue'

// Type declarations
import type { ComputedRef, WritableComputedRef } from 'vue'

// Props
const props = withDefaults(
	defineProps<{
		context?: 'file' | 'identifier' | 'molset'
		loading?: boolean
	}>(),
	{
		context: 'file',
	},
)

// Utils
import { capitalize } from '@/utils/helpers'

/**
 * Computed
 */

// Title
const molName: ComputedRef<string> = computed(() => {
	if (props.loading) return 'Loading'
	return molViewerStore.name
})

// Molecule icon
const molIcon: ComputedRef<string> = computed(() => {
	return props.context == 'molset' ? 'icn-file-molset' : molViewerStore.isSmol ? 'icn-file-smol' : 'icn-file-mmol'
})

// Pagination model
const modelPagination: WritableComputedRef<number> = computed({
	get: () => molViewerStore.molFromMolsetIndex || 1,
	set: molViewerStore.setMolFromMolsetIndex,
})
</script>

<style lang="scss" scoped>
#title-wrap {
	display: flex;
}

// Molecule Icon
#title-wrap .v-align {
	margin-bottom: 10px;
	margin-right: 5px;
}
#title-wrap .icn-mol {
	margin-left: -4px;
}
#title-wrap .icn-mol.loading {
	animation: rotate 3s infinite linear;
}

// Title
#title-wrap h1.loading {
	opacity: 0.3;
}
#title-wrap h1.loading::after {
	content: '';
	animation: ellipsis 800ms infinite;
}

// Filler
#title-wrap .filler {
	flex: 1;
}

// Pagination
#title-wrap .pagination {
	margin-left: 8px;
}
</style>
