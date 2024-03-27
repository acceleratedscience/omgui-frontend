<template>
	<div id="breadcrumbs-wrap" :class="{ truncate }">
		<div id="breadcrumbs" ref="$breadcrumbs" :class="{ truncate, 'needs-truncated': needsTruncation }">
			<button id="file-type" @click="modalStore.display('ModalFileType')">
				{{ fileType }}
			</button>
			<template v-for="(item, i) in props.pathArray" :key="i">
				<span v-if="i == props.pathArray.length - 1">{{ item }}</span>
				<router-link v-else-if="i === 0" :to="'/~/'" class="dumb">{{ item }}</router-link>
				<router-link v-else :to="'/~/' + props.pathArray.slice(1, i + 1).join('/')" class="dumb">{{ item }}</router-link>
				<span v-if="i < props.pathArray.length - 1">&nbsp;&nbsp;&rsaquo;&nbsp;&nbsp;</span>
			</template>
			<a v-if="needsTruncation && !truncate" href="#" class="toggle-hide" @click.prevent="toggleTruncate">hide</a>
		</div>
		<a v-if="needsTruncation && truncate" href="#" class="toggle-show" @click.prevent="toggleTruncate">show</a>
		<div class="bc-right">
			<slot></slot>
			<IconButton icon="icn-doc" iconHover="icn-doc-full" btnStyle="soft" mini @click="fileSystemApi.openFileOS(fileStore.pathAbsolute)" />
		</div>
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

// API
import { fileSystemApi } from '@/api/ApiService'

// Components
import IconButton from '@/components/IconButton.vue'

// Props
const props = defineProps<{
	pathArray: string[]
	fileType?: string
}>()

// Definitions
const $breadcrumbs = ref<HTMLElement | null>(null)
const truncate = ref<boolean>(true) // Lets us toggle truncation
const needsTruncation = ref<boolean>(false) // Lets us check if the breadcrumbs are truncated

/**
 * Computed
 */

const fileType = computed(() => props.fileType ?? fileStore.fileType)

/**
 * Hooks
 */

onMounted(() => {
	if ($breadcrumbs.value && $breadcrumbs.value.offsetWidth < $breadcrumbs.value.scrollWidth) {
		needsTruncation.value = true
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
$br-height: 20px;

#breadcrumbs-wrap {
	display: flex;
	font-size: $font-size-small;
	line-height: $br-height;
	color: $black-30;
}
#breadcrumbs {
	flex: 1;
	margin-bottom: 16px;
	display: flex;
	// background: pink;
}
#breadcrumbs a {
	color: $black-30;
	display: inline-block;
	height: $br-height;
	line-height: $br-height;
	// background: brown;
}

// Truncation at end
#breadcrumbs.truncate {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
#breadcrumbs-wrap:not(.truncate),
#breadcrumbs:not(.truncate) {
	display: block;
}

// Show-more link for truncated breadcrumbs
#breadcrumbs-wrap a.toggle-show,
#breadcrumbs-wrap a.toggle-hide {
	color: $black;
}
#breadcrumbs-wrap .toggle-show::before,
#breadcrumbs-wrap .toggle-hide::before {
	content: '\a0\a0';
}

// Right side
#breadcrumbs ~ .bc-right {
	display: flex;
	height: $br-height;
	line-height: $br-height;
}
#breadcrumbs:deep() ~ .bc-right .icn-btn {
	margin: -2px 0;
	// background: pink;
}
#breadcrumbs:deep() ~ .bc-right .icn-btn:first-of-type {
	margin-left: 4px;
}

// File type button
#file-type {
	color: $black;
	background: $black-10;
	border: none;
	padding: 2px 4px;
	box-sizing: content-box;
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
