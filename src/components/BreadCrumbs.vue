<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	path: string
}>()

const pathArr = computed(() => {
	return props.path.split('/')
})
</script>

<template>
	<div id="breadcrumbs">
		<template v-for="(item, i) in pathArr" :key="i">
			<span v-if="i == pathArr.length - 1">{{ item }}</span>
			<router-link v-else :to="'/~/' + pathArr.slice(0, i + 1).join('/')">{{
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
