<template>
	<cv-modal :visible="modalStore.visible" size="xs" @primary-click="onSubmit" class="scrollable">
		<template v-slot:title>
			<h2>{{ capitalize(mol.identifiers.name) || 'Unnamed Molecule' }}</h2>
		</template>
		<template v-slot:content>
			<h3>Identifiers!</h3>
			<div class="param-wrap">
				<div v-for="(val, key) in mol?.identifiers" :key="key" :class="{ empty: !val }">
					<div v-click-to-copy="!!val" :data-copy="`${key}: ${val}`" class="key">{{ key }}</div>
					<div class="filler"></div>
					<div v-click-to-copy="!!val" class="val">{{ val ? val : '-' }}</div>
				</div>
			</div>

			<hr />

			<h3>Properties</h3>
			<div class="param-wrap">
				<div v-for="(val, key) in mol?.properties" :key="key" :class="{ empty: !val && val !== 0 }">
					<div v-click-to-copy="!!val || val === 0" :data-copy="`${key}: ${val}`" class="key">{{ key }}</div>
					<div class="filler"></div>
					<div v-click-to-copy="!!val || val === 0" class="val">{{ val || val === 0 ? val : '-' }}</div>
				</div>
			</div>
		</template>
		<template v-slot:secondary-button>Cancel</template>
		<template v-slot:primary-button>Open</template>
	</cv-modal>
</template>

<script setup lang="ts">
// Vue
import { computed, onMounted } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
import { useMolViewerStore } from '@/stores/MolViewerStore'
const modalStore = useModalStore()
const molViewerStore = useMolViewerStore()

// Utils
import { capitalize } from '@/utils/helpers'

// Type declarations
import type { Smol } from '@/types'

// Emits
const emit = defineEmits(['mounted'])

/**
 * Computed
 */

const mol = computed<Smol>(() => modalStore.data as Smol)

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
	molViewerStore.setMolFromMolsetIndex(mol.value.index!)
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
