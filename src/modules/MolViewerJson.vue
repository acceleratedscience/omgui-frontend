<template>
	<pre>{{ mol }}</pre>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMolViewerStore, type Mol } from '@/stores/MolViewerStore'
const molViewerStore = useMolViewerStore()
const mol = computed((): Mol | null => molViewerStore.mol)
</script>

<style lang="scss" scoped>
pre {
	tab-size: 30px;
}
</style>
