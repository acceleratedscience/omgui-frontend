<template>
	<div id="breadcrumbs">
		<button id="file-type" @click="modalStore.display('ModalFileType')">
			{{ fileStore.fileType }}
		</button>
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

<script setup lang="ts">
// Vue
import { computed } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useFileStore } from '@/stores/FileStore'
import { useModalStore } from '@/stores/ModalStore'
const mainStore = useMainStore()
const fileStore = useFileStore()
const modalStore = useModalStore()

// Definitions
const props = defineProps<{
	path: string
}>()
const pathArr = computed(() => {
	return [mainStore.workspace].concat(props.path.split('/'))
})

//
//
</script>

<style lang="css" scoped>
#file-type {
	color: var(--ibm-black);
	background: var(--black-10);
	border: none;
	padding: 0 4px;
	height: 16px;
	line-height: 16px;
	border-radius: 2px;
	text-transform: uppercase;
	font-size: var(--font-size-small);
	font-weight: 600;
	margin-right: 7px;
	cursor: pointer;
}
#file-type:hover {
	color: #fff;
	background: var(--ibm-black);
}
#breadcrumbs {
	margin-bottom: 8px;
}
#breadcrumbs,
#breadcrumbs a {
	color: var(--black-30);
	font-size: var(--font-size-small);
	line-height: var(--line-height-small);
}
#breadcrumbs a:hover {
	color: var(--black-60);
}
</style>
