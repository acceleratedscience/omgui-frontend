<template>
	<div
		class="icn-btn"
		:class="{
			on: toggleState,
			opaque: props.btnStyle == 'opaque',
			soft: props.btnStyle == 'soft',
			toggle: props.toggle,
			'has-hover-icn': props.iconHover,
		}"
		@click="onClick"
		:style="styleParam"
	>
		<SvgServe class="base-icn" :filename="props.icon" size="large" />
		<SvgServe v-if="props.iconHover" class="hover-icn" :filename="props.iconHover" size="large" />
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
		btnStyle?: 'default' | 'soft' | 'opaque'
		toggle?: boolean
		color?: string
		colorHover?: string
		colorToggle?: string
	}>(),
	{
		btnStyle: 'default',
		colorToggle: '#393939', // $black-10
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
	.icn-btn:not(.soft):not(.toggle):not(.opaque):hover {
		background-color: $black-05;
	}
	.icn-btn:hover:deep() svg {
		fill: var(--btn-color-hover);
	}

	// Opaque style
	.icn-btn:not(.soft).opaque:hover {
		background-color: $soft-bg;
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
