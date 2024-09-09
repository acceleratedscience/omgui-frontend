<template>
	<div v-if="molViewerStore.isMmol" id="mmol-details">
		<div class="title">mmol.json</div>
		<div><b>Macromolecule type:</b> {{ molViewerStore.molType }}</div>
		<div><b>3D Data format:</b> {{ molViewerStore.proteinData3DFormat }}</div>
	</div>
</template>

<script setup lang="ts">
// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
const molViewerStore = useMolViewerStore()
</script>

<style lang="scss" scoped>
#mmol-details {
	background: $black-05;
	font-size: $font-size-small;
	padding: 16px;
	margin-top: 16px;
}
#mmol-details .title {
	font-size: $font-size;
	font-weight: bold;
	margin-bottom: 8px;
}
</style>
