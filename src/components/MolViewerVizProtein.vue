<template>
	<MolRender3D :pdb="molViewerStore.proteinPdb" :molName="molViewerStore.name" />
</template>

<script setup lang="ts">
// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
const molViewerStore = useMolViewerStore()

// Components
import MolRender3D from '@/components/MolRender3D.vue'
</script>

<style lang="scss" scoped>
// 2D molecule
.container-2d {
	background: $soft-bg;
	display: flex;
	align-items: center;
	justify-content: center;
}
.container-2d:deep() svg {
	max-width: 100%;
}
.container-2d:deep() svg rect:first-child {
	display: none;
}
</style>
