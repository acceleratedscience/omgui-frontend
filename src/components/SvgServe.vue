<template>
	<SvgComponent
		v-if="SvgComponent"
		viewBox="0 0 16 16"
		class="svg"
		:style="{ '--svg-dims': dimensions }"
	/>
	<div v-else class="svg-placeholder" :style="{ '--svg-dims': dimensions }"></div>
</template>

<script lang="ts" setup>
import { shallowRef, computed, onMounted } from 'vue'

// Props
const props = withDefaults(
	defineProps<{
		filename: string
		size?: 'small' | 'large'
	}>(),
	{
		size: 'small',
	},
)

// Definitions
const SvgComponent = shallowRef<{ template?: string } | null>(null)

// Calculate dimensions
const dimensions = computed(() => {
	if (props.size === 'large') {
		return '24px'
	} else {
		return '16px'
	}
})

// Load component
onMounted(async () => {
	const filename = props.filename.replace(/\.svg$/, '')
	const { default: svgComp } = await import(`@/assets/icons/${filename}.svg?component`)
	SvgComponent.value = svgComp
})
</script>

<style scoped lang="scss">
.svg {
	width: var(--svg-dims);
	height: var(--svg-dims);
}
</style>
