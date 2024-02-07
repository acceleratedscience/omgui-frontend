<script setup lang="ts">
// Components
import RouterViewKA from '@/components/RouterViewKA.vue'
</script>

<template>
	<div id="main-wrap">
		<header>
			<nav>
				<RouterLink :to="{ name: 'home' }">Home</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'filebrowser' }">File Browser</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'molviewer' }">Molecule Viewer</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'molgrid' }">Molecule Grid</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'dataviewer' }">Data Viewer</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'jsonviewer' }">JSON Viewer</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'textviewer' }">Text Viewer</RouterLink>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'module-a' }">Module A</RouterLink
				>&nbsp;&nbsp;|&nbsp;&nbsp;
				<RouterLink :to="{ name: 'module-b' }">Module B</RouterLink>
			</nav>
		</header>
		<div id="body" style="border: solid 1px">
			<RouterViewKA />
			<!-- <RouterView v-slot="{ Component }">
				<KeepAlive>
					<component :is="Component" />
				</KeepAlive>
			</RouterView> -->
		</div>
	</div>
</template>
