<template>
	<div class="svg-wrap" v-html="svgContent" :style="{ '--svg-dims': dimentions }"></div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
	props: {
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
	},
	data() {
		return {
			svgContent: '',
		}
	},
	computed: {
		dimentions() {
			if (this.size === 'large') {
				return '24px'
			} else {
				return '16px'
			}
		},
	},
	async created() {
		try {
			const response = await axios.get(`/svg/${this.filename.replace(/\.svg$/, '')}.svg`)
			this.svgContent = response.data
		} catch (error) {
			console.error('Failed to load SVG', error)
		}
	},
}
</script>

<style scoped lang="scss">
.svg-wrap {
	display: inline-block;
	font-size: 0;
	line-height: 0;
}
.svg-wrap:deep() svg {
	display: block;
	width: var(--svg-dims);
	height: var(--svg-dims);
}
</style>
