<template>
	<div ref="$container3d"></div>
</template>

<script setup lang="ts">
// Libraries
// import Miew from 'miew' // Waiting for fix, self-hosting until then - see https://github.com/epam/miew/issues/524
// console.log(123)
// import Miew from '@/TEMP/miew/dist/miew.module'
// @ts-ignore
import Miew from '@/TEMP/miew/dist/Miew'
import '@/TEMP/miew/dist/miew.min.css'

import { onMounted, ref } from 'vue'
const $container3d = ref<Element | null>(null)
let miewViewer: any = null

onMounted(() => {
	const viewer = new Miew({ load: '1CRN' })
})
</script>
