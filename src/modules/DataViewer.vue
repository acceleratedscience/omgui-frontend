<script setup lang="ts">
// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()
</script>

<template>
	<!-- <router-link to="/~/sample.csv">sample</router-link> |
	<router-link to="/~/foo.csv">foo</router-link> -->
	<main id="module">This is the dataviewer component</main>
	<pre v-if="fileStore.data" id="file-content">{{ fileStore.data }}</pre>
	<div v-else-if="fileStore.errCode">{{ fileStore.errCode }}</div>
</template>

<style lang="css" scoped>
#module {
	background: lightblue;
	padding: 4px;
	margin-bottom: 20px;
}
#file-content {
	white-space: pre-wrap;
}
</style>
