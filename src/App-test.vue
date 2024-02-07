<script setup lang="ts">
// Stores
import { computed } from 'vue'

import { useMainStore } from '@/stores/MainStore'
const mainStore = useMainStore()

import AppFull from '@/AppFull.vue'
import AppRaw from '@/AppRaw.vue'

const currentView = computed(() => {
	if (mainStore.isHeadless) {
		return AppRaw
	} else {
		return AppFull
	}
})
</script>

<template>
	<!-- Dev only: toggle headless -->
	<input
		type="checkbox"
		@click="mainStore.toggleHeadless(true)"
		style="position: fixed; top: 2px; left: 2px; z-index: 10"
		:checked="!mainStore.isHeadless"
	/>

	<KeepAlive>
		<component :is="currentView" />
	</KeepAlive>
</template>

<style scoped lang="scss">
/**
 * Headless
 */
#headless-wrap {
	padding: 20px;
}

/**
  * Normal
  */
#main-wrap {
	display: flex;
	flex-direction: column;
	position: relative;
	margin: 40px;
	// left: 40px;
	// top: 40px;
}
header {
	width: 100%;
	min-height: 40px;
	border-bottom: solid 1px #eee;
	margin-bottom: 20px;
	// background: yellow;
}
nav {
	min-height: 40px;
	line-height: 30px;
	padding-bottom: 10px;
	position: sticky;
	top: 20px;
	left: 40px;
	display: inline-block;
	width: calc(100vw - 80px);
}
// #body {
//     // background: orange;
// }
</style>
