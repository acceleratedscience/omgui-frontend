<script setup lang="ts">
// Stores
import { useMainStore } from '@/stores/MainStore'
const mainStore = useMainStore()
</script>

<template>
	<main>
		<template v-if="mainStore.headless">
			<h1>You're in Headless Mode</h1>
			<a href="#" @click.prevent="mainStore.unsetHeadless(true)">Exit headless mode</a>
			<br /><br />
		</template>
		<p>Welcome to the peristent GUI prototype.</p>
		<p>
			Every route can be loaded in headless mode, which hides the application wrapper with the
			navigation.
		</p>
		<p>
			This makes it easy to import individual modules into a Jupyter Notebook or your own
			application.
		</p>
		<p>
			When you're in headless mode, all links you click will automatically be forwarded to
			their headless counterpart.
		</p>

		<br />
		<cv-button @click.prevent="mainStore.toggleHeadless(true)">Toggle headless</cv-button>
	</main>
</template>

<style lang="css" scoped></style>
