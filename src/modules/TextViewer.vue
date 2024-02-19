<script setup lang="ts">
// Vue
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

defineProps({
	filePath: String,
})

const path = computed(() => {
	return route.query.path
})
</script>

<template>
	<main id="module">This is the Text viewer component {{ path }}!</main>
</template>

<style lang="css" scoped>
#module {
	background: peachpuff;
	padding: 24px;
}
</style>
