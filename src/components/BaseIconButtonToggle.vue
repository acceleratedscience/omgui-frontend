<template>
	<div
		class="icn-btn"
		:class="{
			[props.icon]: true,

			// Size
			mini: props.mini,

			// Toggle state
			'toggle-on': toggleState,
			'ignore-hover': ignoreHover,

			// Custom colors
			'has-hover-icn': props.iconHover,
			'has-on-icn': props.iconOn,
			'has-on-hover-icn': props.iconOnHover,
			'has-custom-color': !!props.color,
			'has-custom-hover-color': !!props.colorHover,
			'has-custom-toggle-color': !!props.colorOn,
		}"
		@click="toggle()"
		@mouseleave="ignoreHover = false"
		:style="styleParam"
	>
		<BaseIcon class="base-icn" :icon="props.icon" />
		<BaseIcon v-if="props.iconHover" class="hover-icn" :icon="props.iconHover" />
		<BaseIcon v-if="props.iconOn" class="on-icn" :icon="props.iconOn" />
		<BaseIcon v-if="props.iconOnHover" class="on-hover-icn" :icon="props.iconOnHover" />
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue'

// Components
import BaseIcon from '@/components/BaseIcon.vue'

// Type declarations
type StyleParam = {
	'--btn-color'?: string
	'--btn-color-hover'?: string
	'--btn-color-on'?: string
	'--btn-color-on-hover'?: string
}

// Emits
const emit = defineEmits(['toggle-on', 'toggle-off'])

// Props
const props = defineProps<{
	// Icon
	icon: string
	iconHover?: string
	iconOn?: string
	iconOnHover?: string

	// Color
	color?: string
	colorHover?: string
	colorOn?: string
	colorOnHover?: string

	// Style
	mini?: boolean
}>()

// Definitions
const toggleState = ref<boolean>(false)
const ignoreHover = ref<boolean>(false) // Prevent hover effect when toggled, until mouse is moved out
const defaultColors: { [key: string]: string } = {
	soft: 'rgba(0,0,0,.3)',
	semiSoft: 'rgba(0,0,0,.6)',
	hard: '#393939',
}

/**
 * Computed
 */

const styleParam = computed<StyleParam>(() => {
	const style: StyleParam = {}
	style['--btn-color'] = props.color ? props.color : defaultColors.soft
	style['--btn-color-hover'] = props.colorHover ? props.colorHover : defaultColors.soft
	style['--btn-color-on'] = props.colorOn ? props.colorOn : defaultColors.hard
	style['--btn-color-on-hover'] = props.colorOnHover ? props.colorOnHover : defaultColors.hard
	return style
})

/**
 * Methods
 */

function toggle(value: boolean | undefined = undefined, noEmit = false) {
	if (value !== undefined) {
		toggleState.value = value
	} else {
		toggleState.value = !toggleState.value
	}
	if (toggleState.value) {
		ignoreHover.value = true
		if (!noEmit) emit('toggle-on')
	} else {
		if (!noEmit) emit('toggle-off')
	}
}

// Expose methods to parent.
defineExpose({
	toggle,
})
</script>

<style lang="scss" scoped>
.icn-btn {
	width: 40px;
	height: 40px;
	padding: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: $black;
	border-radius: 2px;
	color: var(--btn-color);
}

// Mini
.icn-btn.mini {
	width: 24px;
	height: 24px;
	padding: 0;
}

// Toggle state
.icn-btn .hover-icn,
.icn-btn.toggle-on .base-icn,
.icn-btn:not(.toggle-on) .on-icn,
.icn-btn .on-hover-icn {
	display: none;
}
.icn-btn.toggle-on {
	color: var(--btn-color-on);
}

@media (hover: hover) {
	// Hover state in OFF mode
	.icn-btn:not(.ignore-hover):not(.has-on-hover-icn.toggle-on):hover .hover-icn {
		display: block;
	}
	.icn-btn:not(.ignore-hover).has-hover-icn:hover .base-icn {
		display: none;
	}
	.icn-btn:hover {
		color: var(--btn-color-hover);
	}

	// Hover state in ON mode
	.icn-btn:not(.ignore-hover).has-on-hover-icn.toggle-on:hover .on-hover-icn {
		display: block;
	}
	.icn-btn.ignore-hover.has-on-hover-icn.toggle-on:hover .on-icn {
		display: block;
	}
	.icn-btn:not(.ignore-hover).has-on-hover-icn:hover .base-icn,
	.icn-btn.has-on-hover-icn:hover .on-icn {
		display: none;
	}
	.icn-btn.toggle-on:hover {
		color: var(--btn-color-on-hover);
	}
}
</style>
