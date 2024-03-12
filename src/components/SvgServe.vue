<template>
	<!-- <div v-html="svgComponent?.template"></div> -->
	<component v-if="svgComponent" :is="svgComponent" :style="{ '--svg-dims': dimensions }" />
	<div v-else></div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, shallowRef, computed, onMounted, watchEffect } from 'vue'

const props = defineProps({
	filename: {
		type: String,
		required: true,
	},
	size: {
		type: String,
		validator: function (value: string) {
			return ['small', 'large'].includes(value)
		},
		default: 'small',
	},
})

const svgContent = ref<string>('')
const svgComponent = shallowRef<{ template?: string } | null>(null)

const dimensions = computed(() => {
	if (props.size === 'large') {
		return '24px'
	} else {
		return '16px'
	}
})

watchEffect(() => {
	if (svgContent.value) {
		// console.log(11, props.filename, svgContent.value)
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
svg {
	width: var(--svg-dims);
	height: var(--svg-dims);
}
</style>
