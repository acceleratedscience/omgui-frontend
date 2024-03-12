<template>
	<component
		v-if="svgComponent"
		:is="svgComponent"
		class="svg"
		:style="{ '--svg-dims': dimensions }"
	/>
	<div v-else class="svg-placeholder" :style="{ '--svg-dims': dimensions }"></div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, shallowRef, computed, onMounted, watchEffect } from 'vue'
import type { PropType } from 'vue'

// Type declarations
type Props = {
	filename: string
	size: 'small' | 'large'
}

// Props
const props = defineProps({
	filename: {
		type: String as PropType<Props['filename']>,
		required: true,
	},
	size: {
		type: String as PropType<Props['size']>,
		default: 'small',
		validator: (value: Props['size']) => ['small', 'large'].includes(value),
	},
})

// Definitions
const svgContent = ref<string>('')
const svgComponent = shallowRef<{ template?: string } | null>(null)

/**
 * Computed
 */

const dimensions = computed(() => {
	if (props.size === 'large') {
		return '24px'
	} else {
		return '16px'
	}
})

/**
 * Hooks
 */

watchEffect(() => {
	if (svgContent.value) {
		svgComponent.value = {
			template: svgContent.value,
		}
	}
})

onMounted(loadSvg)

/**
 * Methods
 */

async function loadSvg(filenameOverride?: string) {
	const errMsg = `Failed to load SVG ${props.filename}`
	const filename = filenameOverride || props.filename.replace(/\.svg$/, '')
	try {
		const response = await axios.get(`/svg/${filename}.svg`)
		// The response will always be 200 because if the SVG
		// doesn't exist, it forwards to the Vue router.
		const svgExists = response.data.startsWith('<svg')
		if (svgExists) {
			svgContent.value = response.data
		} else {
			console.error(errMsg)
			loadSvg('icn-fallback')
		}
	} catch (error) {
		console.error(errMsg, error)
		loadSvg('icn-fallback')
	}
}
</script>

<style scoped lang="scss">
.svg,
.svg-placeholder {
	width: var(--svg-dims);
	height: var(--svg-dims);
}
</style>
