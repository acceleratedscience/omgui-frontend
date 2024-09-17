<template>
	<div v-for="(matrixObj, i) in mxObjs" :key="i" class="matrix-wrap-wrap">
		<div v-for="(matrix, mtxName) in matrixObj.matrices" :key="mtxName" class="matrix-wrap">
			<h5 v-if="matrixObj.fields?.id">Matrix {{ matrixObj.fields.id }}</h5>
			<div v-for="(v, k) in matrixObj.fields" :key="k">
				<b>{{ k }}:</b> {{ v }}
			</div>
			<br v-if="Object.keys(matrixObj.fields).length" />
			<div class="small soft">
				Matrix<template v-if="String(mtxName) != '_'"> - {{ mtxName }}</template>
			</div>
			<TheTable :data="matrix" :allowCopy="true" :header="false" />

			<div class="small soft vector">
				Vector<template v-if="String(mtxName) != '_'"> - {{ mtxName }}</template>
			</div>
			<TheTable :data="[matrixObj.vectors[mtxName]]" :allowCopy="true" :header="false" />
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Props
const props = defineProps<{
	mxObjs: any
}>()

/*
 * Computed
 */

const mxObjs: ComputedRef<any> = computed(() => {})

/*
 * Hooks
 */

/*
 * Methods
 */
</script>

<style lang="scss" scoped></style>
