<template>
	<div class="svg-wrap" v-html="svgContent"></div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
	props: ['filename'],
	data() {
		return {
			svgContent: '',
			// width: null,
			// height: null,
		}
	},
	async created() {
		try {
			const response = await axios.get(
				`/src/assets/svg/${this.filename.replace(/\.svg$/, '')}.svg`,
			)
			// console.log(234, `/src/assets/svg/${this.filename}.svg`)
			this.svgContent = response.data
		} catch (error) {
			console.error('Failed to load SVG', error)
		}
	},
	// methods: {
	//     storeSvgDimensions(svgString) {
	//         const parser = new DOMParser()
	//         const doc = parser.parseFromString(svgString, 'image/svg+xml')
	//         const svgElement = doc.documentElement
	//         const width = svgElement.getAttribute('width')
	//         const height = svgElement.getAttribute('height')
	//         this.width = width
	//         this.height = height
	//     },
	// },
}
</script>

<style scoped lang="scss">
.svg-wrap {
	display: inline-block;
	font-size: 0;
	line-height: 0;
}
.svg-wrap svg {
	display: block;
}
</style>
