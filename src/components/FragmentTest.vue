<script>
export default {
	name: 'Fragment',
	render(h) {
		if (this.$slots && this.$slots.default) {
			return this.$slots.default
		}

		return null
	},
}
</script>
