<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'

// Definitions
const mainStore = useMainStore()
const props = defineProps<{
	path: string
}>()
const pathArr = computed(() => {
	return [mainStore.workspace].concat(props.path.split('/'))
})
</script>

<template>
	<div id="breadcrumbs">
		<!-- <div>{{ fileStore.moduleName }}</div> -->
		<template v-for="(item, i) in pathArr" :key="i">
			<span v-if="i == pathArr.length - 1">{{ item }}</span>
			<router-link v-else-if="i === 0" :to="'/~/'">{{ item }}</router-link>
			<router-link v-else :to="'/~/' + pathArr.slice(1, i + 1).join('/')">{{
				item
			}}</router-link>
			<span v-if="i < pathArr.length - 1">&nbsp;&nbsp;&rsaquo;&nbsp;&nbsp;</span>
		</template>
	</div>
</template>

<style lang="css" scoped>
#breadcrumbs {
	margin-bottom: 8px;
}
#breadcrumbs,
#breadcrumbs a {
	color: var(--black-30);
	font-size: var(--font-size-small);
}
#breadcrumbs a:hover {
	color: var(--black-60);
}
</style>
