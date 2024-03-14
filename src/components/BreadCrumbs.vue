<template>
	<div id="breadcrumbs-wrap" :class="{ truncate }">
		<div
			id="breadcrumbs"
			ref="$breadcrumbs"
			:class="{ truncate, 'needs-truncated': needsTruncation }"
		>
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
			<a
				v-if="needsTruncation && !truncate"
				href="#"
				class="toggle-hide"
				@click.prevent="toggleTruncate"
				>hide</a
			>
		</div>
		<a
			v-if="needsTruncation && truncate"
			href="#"
			class="toggle-show"
			@click.prevent="toggleTruncate"
			>show</a
		>
		<span v-if="props.slotRight" class="slot">{{ props.slotRight }}</span>
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
type Props = { slotRight: string }

// Props
const props = defineProps({
	slotRight: {
		type: String as PropType<Props['slotRight']>,
	},
})

// Definitions
const $breadcrumbs = ref<HTMLElement | null>(null)
const truncate = ref<boolean>(true) // Lets us toggle truncation
const needsTruncation = ref<boolean>(false) // Lets us check if the breadcrumbs are truncated
const pathArr = computed(() => [mainStore.workspace].concat(fileStore.path.split('/')))

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
#breadcrumbs-wrap {
	display: flex;
	font-size: $font-size-small;
	line-height: $line-height-small;
	color: $black-30;
}
#breadcrumbs {
	flex: 1;
	margin-bottom: 8px;
}
#breadcrumbs a {
	color: $black-30;
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
 * Hover states
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
