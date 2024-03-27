<template>
	<cv-modal :visible="modalStore.visible" size="xs" @primary-click="onSubmit" class="TEST">
		<template v-slot:title>
			<h2>{{ capitalize(mol.identifiers.name) || 'Unnamed Molecule' }}</h2>
		</template>
		<template v-slot:content>
			<h3>Identifiers</h3>
			<div class="param-wrap">
				<div v-for="(val, key) in mol?.identifiers" :key="key" :class="{ empty: !val }">
					<div v-copy-on-click="!!val" :data-copy="`${key}: ${val}`" class="key">{{ key }}</div>
					<div class="filler"></div>
					<div v-copy-on-click="!!val" class="val">{{ val ? val : '-' }}</div>
				</div>
			</div>

			<hr />

			<h3>Properties</h3>
			<div class="param-wrap">
				<div
					v-for="(val, key) in mol?.properties"
					:key="key"
					:title="molViewerStore.propertiesString[key]"
					:class="{ empty: !val && val !== 0 }"
				>
					<div v-copy-on-click="!!val || val === 0" :data-copy="`${key}: ${val}`" class="key">{{ key }}</div>
					<div class="filler"></div>
					<div v-copy-on-click="!!val || val === 0" class="val">{{ val || val === 0 ? val : '-' }}</div>
				</div>
			</div>
		</template>
		<template v-slot:secondary-button>Cancel</template>
		<template v-slot:primary-button>Open</template>
	</cv-modal>
</template>

<script setup lang="ts">
// Vue
import { computed, onMounted, ref } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useModalStore } from '@/stores/ModalStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useMolGridStore } from '@/stores/MolGridStore'
const mainStore = useMainStore()
const modalStore = useModalStore()
const molViewerStore = useMolViewerStore()
const molGridStore = useMolGridStore()

// API
import { fileSystemApi } from '@/api/ApiService'

// Utils
import { capitalize } from '@/utils/helpers'

// Type declarations
import type { Mol } from '@/types'

// Definitions
const emit = defineEmits(['mounted'])
const allWorkspaces = ref<string[]>([' '])
const selectedWorkspace = ref<string>(' ') // Space to avoid default text to display during load

/**
 * Computed
 */

const mol = computed<Mol>(() => modalStore.data as Mol)

/**
 * Hooks
 */

onMounted(() => {
	emit('mounted')
})

/**
 * Methods
 */

async function onSubmit() {
	molGridStore.openMolecule(mol.value.index!)
	modalStore.hide()
}
</script>

<style lang="scss" scoped>
.param-wrap {
	display: flex;
	flex-direction: column;
	gap: 0 40px;
}
.param-wrap > div {
	height: 22px;
	line-height: 22px;
	box-sizing: border-box;
	display: flex;
}
.param-wrap div.empty {
	opacity: 0.3;
}
.param-wrap > div .key {
	flex: 0 0 auto;
	padding-right: 4px;
	font-style: italic;

	/* Truncation */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: calc(100% - 30px);
}
.param-wrap > div .val {
	text-align: right;
	flex: 0 1 auto;
	padding-left: 4px;
	min-width: 0;

	/* Truncation */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.param-wrap > div .filler {
	flex: 1 1;
	overflow: hidden;
}
.param-wrap > div .filler::before {
	content: '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .';
	opacity: 0.3;
}
</style>
