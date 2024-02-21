<script setup lang="ts">
// Stores
import { useFileStore } from '@/stores/FileStore'
const fileStore = useFileStore()
</script>

<template>
	<router-link to="/~/sample.csv">sample</router-link> |
	<router-link to="/~/foo.csv">foo</router-link>
	<main id="module">This is the dataviewer component</main>
	<div v-if="fileStore.data">{{ fileStore.data }}</div>
	<div v-else-if="fileStore.err_msg">{{ fileStore.err_msg }}</div>
</template>

<style lang="css" scoped>
#module {
	background: lightblue;
	padding: 24px;
}
</style>
