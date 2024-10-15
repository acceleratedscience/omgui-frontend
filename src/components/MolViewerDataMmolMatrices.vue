<template>
	<!-- Single matrix:               /mmol/2G64#database_PDB_matrix -->
	<!-- Multiple matrices together:  /mmol/8k1g#atom_sites -->
	<!-- Array of separated matrices: /mmol/2g64#pdbx_struct_oper_list -->
	<div v-for="(matrixObj, i) in mxObjs" :key="i" class="matrix-wrap-wrap">
		<div v-for="(matrix, mtxName) in matrixObj.matrices" :key="mtxName" class="matrix-wrap">
			<h5 v-if="matrixObj.fields?.id">Matrix {{ matrixObj.fields.id }}</h5>
			<div v-for="(v, k) in matrixObj.fields" :key="k">
				• <b>{{ k }}:</b> {{ v }}
			</div>
			<br v-if="Object.keys(matrixObj.fields).length" />
			<div class="small soft">
				Matrix<template v-if="String(mtxName) != '_'"> - {{ mtxName }}</template>
			</div>
			<TableData :data="matrix" :allowCopy="true" :header="false" />

			<div class="small soft vector">
				Vector<template v-if="String(mtxName) != '_'"> - {{ mtxName }}</template>
			</div>
			<TableData :data="[matrixObj.vectors[mtxName]]" :allowCopy="true" :header="false" />
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

// Components
import TableData from '@/components/TableData.vue'

// Props
const props = defineProps<{
	data: any
}>()

/*
 * Computed
 */

const mxObjs: ComputedRef<any> = computed(() => {
	const data = props.data
	if (Array.isArray(data)) {
		return data
	} else {
		return [data]
	}
})
</script>

<style lang="scss" scoped>
.matrix-wrap-wrap {
	margin-top: 40px;
}
.matrix-wrap {
	display: inline-block;
}
.matrix-wrap:deep() table {
	width: 100%;
}
.matrix-wrap .small {
	margin-bottom: 4px;
}
.matrix-wrap .small.vector {
	margin-top: 8px;
}
</style>
