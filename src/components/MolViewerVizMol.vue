<template>
	<!--
        We could use the MolRender2D component to render the SVG in the frontend,
        the same way we do it in the MolGrid module. However, MolRender2D requires
        a SMILES string as input structure and rdkit-js doesn't let us convert
        InChI to SMILES, so when the identifier string is an InChI, we have to
        wait for the main fetchMolData API call to complete in order to get the
        SMILES, which results in a huge delay. So instead we fetch the SVG from
        the API together with the 3D data in a separate call, which is much faster.
    -->
	<!-- <div class="container-2d">
        <MolRender2D
            v-if="mol.identifiers.canonical_smiles"
            id="mol-svg"
            :structure="mol.identifiers.canonical_smiles.toString()"
            :width="300"
            :height="300"
            svg-mode
        />
    </div> -->
	<div class="container-2d" v-html="molViewerStore.svg"></div>
	<MolRender3D :mdl="molViewerStore.mdl" :molName="molViewerStore.name" />
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
