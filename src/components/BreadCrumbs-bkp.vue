<template>
	<div id="breadcrumbs">
		<div id="truncation" ref="$truncation" :class="{ truncate, 'is-truncated': isTruncated }">
			<button id="file-type" @click="modalStore.display('ModalViewer')">
				{{ fileStore.fileType }}
			</button>
			<template v-for="(item, i) in pathArr" :key="i">
				<span v-if="i == pathArr.length - 1">{{ item }}</span>
				<router-link v-else-if="i === 0" :to="'/~/'">{{ item }}</router-link>
				<router-link v-else :to="'/~/' + pathArr.slice(1, i + 1).join('/')">{{ item }}</router-link>
				<span v-if="i < pathArr.length - 1">&nbsp;&nbsp;&rsaquo;&nbsp;&nbsp;</span>
			</template>
		</div>
		<a href="#" class="show" @click.prevent="toggleTruncate">show</a>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'

// Stores
import { useMainStore } from '@/stores/MainStore'
import { useFileStore } from '@/stores/FileStore'
import { useModalStore } from '@/stores/ModalStore'
const mainStore = useMainStore()
const fileStore = useFileStore()
const modalStore = useModalStore()

// Type declarations
type Props = { path: string }

// Props
const props = defineProps({
	path: {
		type: String as PropType<Props['path']>,
		required: true,
	},
})

// Definitions
const $truncation = ref<HTMLElement | null>(null)
const truncate = ref<boolean>(true) // Lets us toggle truncation
const isTruncated = ref<boolean>(false) // Lets us check if the breadcrumbs are truncated
const pathArr = computed(() => [mainStore.workspace].concat(props.path.split('/')))

/**
 * Hooks
 */

onMounted(() => {
	if ($truncation.value && $truncation.value.offsetWidth < $truncation.value.scrollWidth) {
		isTruncated.value = true
	}
})

/**
 * Definitions
 */

function toggleTruncate() {
	truncate.value = !truncate.value
}
</script>

<style lang="scss" scoped>
#breadcrumbs {
	font-size: $font-size-small;
	line-height: $line-height-small;
	color: $black-30;
	margin-bottom: 8px;
}
#breadcrumbs a {
	color: $black-30;
}

// Truncation
#truncation {
	display: flex;
	gap: 2px;
	background: pink;
}
#truncation.truncate {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

// Show-more link for truncated breadcrumbs
#truncation:not(.is-truncated) + .show {
	display: none;
}

// File type button
#file-type {
	color: $black;
	background: $black-10;
	border: none;
	padding: 0 4px;
	height: 16px;
	line-height: 16px;
	border-radius: 2px;
	text-transform: uppercase;
	font-size: $font-size-small;
	font-weight: 600;
	margin-right: 7px;
	cursor: pointer;
}

/**
 * Hover
 */

@media (hover: hover) {
	#file-type:hover {
		color: #fff;
		background: $black;
	}
	#breadcrumbs a:hover {
		color: $black-60;
	}
}
</style>
