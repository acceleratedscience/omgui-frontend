<template>
	<div
		class="icn-btn"
		:class="{
			[props.icon]: true,
			on: toggleState,
			opaque: props.btnStyle == 'opaque',
			soft: props.btnStyle == 'soft',
			carbon: props.btnStyle == 'carbon',
			mini: props.mini,
			toggle: props.toggle,
			'has-hover-icn': props.iconHover,
		}"
		@click="onClick"
		:style="styleParam"
	>
		<SvgServe class="base-icn" :icon="props.icon" :size="iconSize" />
		<SvgServe v-if="props.iconHover" class="hover-icn" :icon="props.iconHover" :size="iconSize" />
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue'

// Components
import SvgServe from '@/components/SvgServe.vue'

// Type declarations
type StyleParam = {
	'--btn-color': string
	'--btn-color-hover': string
	'--btn-color-toggle'?: string
}

// Props
const props = withDefaults(
	defineProps<{
		icon: string
		iconHover?: string
		btnStyle?: 'default' | 'soft' | 'opaque' | 'carbon' // See /kitchen-sink for examples
		toggle?: boolean
		color?: string
		colorHover?: string
		colorToggle?: string
		icnSize?: 'small' | 'large'
		mini?: boolean
	}>(),
	{
		btnStyle: 'default',
		colorToggle: '#393939', // $black-10
		size: 'large',
	},
)

// Definitions
const toggleState = ref<boolean>(false)
const defaults: { [key: string]: string } = {
	soft: 'rgba(0,0,0,.3)',
	semiSoft: 'rgba(0,0,0,.6)',
	hard: '#393939',
}

/**
 * Computed
 */

const color = computed<string>(() => {
	return props.color ? props.color : props.btnStyle == 'soft' || props.toggle ? defaults.soft : defaults.hard
})

const colorHover = computed<string>(() => {
	return props.colorHover ? props.colorHover : props.btnStyle == 'soft' ? defaults.hard : props.toggle ? defaults.semiSoft : defaults.hard
})

const styleParam = computed<StyleParam>(() => {
	const style: StyleParam = {
		'--btn-color': color.value,
		'--btn-color-hover': colorHover.value,
	}
	if (props.toggle) {
		style['--btn-color-toggle'] = props.colorToggle
	}

	return style
})

const iconSize = computed<'small' | 'large'>(() => {
	if (props.btnStyle == 'mini') {
		return 'small'
	} else {
		return props.size
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
	border-radius: 2px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.icn-btn.carbon {
	background: $soft-bg;
	border-radius: 0;
}
.icn-btn.mini {
	width: 24px;
	height: 24px;
	padding: 0;
}
.icn-btn:deep() svg {
	fill: var(--btn-color);
}
.icn-btn.on:deep() svg {
	fill: var(--btn-color-toggle);
}

@media (hover: hover) {
	// Custon hover icon
	// Note: when toggle mode is used, the hover icon is also used for the on state.
	.icn-btn.has-hover-icn:not(.on):not(:hover) .hover-icn,
	.icn-btn.has-hover-icn:hover .base-icn,
	.icn-btn.has-hover-icn.on .base-icn {
		display: none;
	}

	// Default & soft styles
	.icn-btn:not(.soft):not(.opaque):not(.carbon):not(.toggle):hover {
		background-color: $black-05;
	}
	.icn-btn:hover:deep() svg {
		fill: var(--btn-color-hover);
	}

	// Opaque style
	.icn-btn:not(.soft).opaque:hover {
		background-color: $soft-bg;
	}

	.icn-btn.carbon:hover {
		background: $soft-bg-hover;
	}

	// Toggle mode style
	// .icn-btn.toggle:hover:deep() svg {
	// 	fill: $black-60;
	// }

	// Toggle mode
	.icn-btn.on:hover:deep() svg {
		fill: var(--btn-color-toggle);
	}
}
</style>
