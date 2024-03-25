<template>
	<div
		class="icn-btn"
		:class="{
			[props.icon]: true,

			// Size
			mini: props.mini,

			// Button styles
			default: props.btnStyle == 'default',
			soft: props.btnStyle == 'soft',
			carbon: props.btnStyle == 'carbon',

			// Toggle type
			toggle: props.toggle,
			'toggle-on': toggleState,

			// Selection state
			sel: props.sel,

			// Custom colors
			'has-secondary-icn': props.iconHover,
			'has-custom-color': !!props.color,
			'has-custom-hover-color': !!props.colorHover,
			'has-custom-toggle-color': !!props.colorToggle,
		}"
		@click="onClick"
		:style="styleParam"
	>
		<SvgServe class="base-icn" :icon="props.icon" :size="iconSize" />
		<SvgServe v-if="props.iconHover" class="secondary-icn" :icon="props.iconHover" :size="iconSize" />
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue'

// Components
import SvgServe from '@/components/SvgServe.vue'

// Type declarations
type StyleParam = {
	'--btn-color'?: string
	'--btn-color-hover'?: string
	'--btn-color-toggle'?: string
}

// Props
const props = withDefaults(
	defineProps<{
		icon: string
		iconHover?: string
		btnStyle?: 'default' | 'soft' | 'carbon' // See /kitchen-sink for examples
		toggle?: boolean
		color?: string
		colorHover?: string
		colorToggle?: string
		icnSize?: 'small' | 'large'
		mini?: boolean
		sel?: boolean
	}>(),
	{
		btnStyle: 'default',
		icnSize: 'small',
	},
)

// Definitions
const toggleState = ref<boolean>(false)
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
	if (props.color) {
		style['--btn-color'] = props.color ? props.color : defaultColors.soft
	}
	if (props.colorHover) {
		style['--btn-color-hover'] = props.colorHover ? props.colorHover : defaultColors.hard
	}
	if (props.colorToggle) {
		style['--btn-color-toggle'] = props.colorToggle ? props.colorToggle : defaultColors.hard
	}

	return style
})

const iconSize = computed<'small' | 'large'>(() => {
	if (props.mini || props.icnSize == 'small') {
		return 'small'
	} else {
		return props.icnSize
	}
})

/**
 * Methods
 */

function onClick() {
	if (props.toggle) {
		toggleState.value = !toggleState.value
	}
}
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
}

// Mini
.icn-btn.mini {
	width: 24px;
	height: 24px;
	padding: 0;
}

// Soft
.icn-btn.soft {
	color: $black-30;
}

// Carbon
.icn-btn.carbon {
	background: $soft-bg;
}

// Toggle
.icn-btn.toggle {
	color: $black-30;
}
.icn-btn.toggle.toggle-on {
	color: $black;
}
.icn-btn.has-secondary-icn:not(.toggle-on):not(:hover):not(.sel) .secondary-icn,
.icn-btn.has-secondary-icn.toggle-on .base-icn,
.icn-btn.has-secondary-icn.sel .base-icn {
	display: none;
}

// Custom colors
.icn-btn.has-custom-color {
	color: var(--btn-color);
}
.icn-btn.has-custom-toggle-color.toggle-on {
	color: var(--btn-color-toggle);
}

@media (hover: hover) {
	// Default
	.icn-btn:hover {
		background: $black-05;
		border-radius: 2px;
	}

	// Soft
	.icn-btn.soft:hover {
		color: $black;
		background: none;
	}

	// Carbon
	.icn-btn.carbon:hover {
		background: $soft-bg-hover;
	}

	// Toggle
	.icn-btn.toggle:hover {
		color: $black;
		background: none;
	}
	.icn-btn.has-secondary-icn:hover .base-icn {
		display: none;
	}
	.icn-btn.toggle-on:hover {
		color: $black-60;
		background: none;
	}
	.icn-btn.has-custom-toggle-color:hover {
		background: none;
	}
	.icn-btn.has-custom-toggle-color.toggle-on:hover {
		color: var(--btn-color-toggle);
		filter: brightness(0.9);
	}

	// Custom colors
	.icn-btn.has-custom-hover-color:hover {
		color: var(--btn-color-hover);
		background: none;
	}
}
</style>
