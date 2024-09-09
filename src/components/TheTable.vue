<template>
	<table v-copy-on-click="allowCopy" :data-copy="allowCopy ? copyData : null">
		<thead v-if="header">
			<tr>
				<th v-for="(cell, i) in table.header" :key="i"><span v-html="cell || `<span class='soft'>-</span>`"></span></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row, i) in table.body" :key="i">
				<td v-for="(cell, j) in row" :key="j"><span v-html="cell || `<span class='soft'>-</span>`"></span></td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
// Vue
import { onMounted, watch, computed } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
const modalStore = useModalStore()

// Type declarations
type Table = {
	header: string[] | number[]
	body: Array<{ [key: string]: string | number }>
}

// Props
const props = withDefaults(
	defineProps<{
		data: any
		header?: boolean
		allowCopy?: boolean
	}>(),
	{
		header: true,
		allowCopy: false,
	},
)

// Type declarations
import type { ComputedRef } from 'vue'
type DataStructure = 'A' | 'B' | null

/*
 * Computed
 */

const data: ComputedRef<any> = computed(() => {
	const struct = detectDataStructure(props.data)
	return restructureData(props.data, struct)
})

const copyData: ComputedRef<string> = computed(() => {
	let output = ''
	let i = 0
	for (const row in data.value) {
		if (i > 0 || props.header) {
			output += data.value[row].join(',') + '\n'
		}
		i++
	}
	return output
})

const table: ComputedRef<Table> = computed(() => {
	const output = {
		header: [],
		body: [],
	}
	for (let i = 0; i < data.value.length; i++) {
		const row = data.value[i]
		if (Array.isArray(row)) {
			if (i === 0) {
				row.forEach((cell: string | number) => {
					output.header.push(cell)
				})
			} else {
				output.body.push(row)
			}
		}
	}
	return output
})

/*
 * Hooks
 */

/*
 * Methods
 */

// Parse input data and return its structure category (A, B, C, etc.)
function detectDataStructure(data: any): DataStructure {
	if (typeof data == 'object' && data !== null) {
		let i = 0
		for (const key in Object.keys(data)) {
			// console.log('%', +key, i)
			if (+key !== i) return null
			i++
		}
		return 'A'
	}
	return null
}

// Restructure a data object into an array of arrays.
//
// Input data structure A:
// Input: { 0: { key1: 'foo', key2: 'bar' }, 1: { key1: 'goo', key2: 'car' } }
// Output: [ ['key1', 'key2'], ['foo', 'bar'], ['goo', 'car'] ]
//
// Input data structure B:
// TBD (wil be extended as needed)
function restructureData(data: any, struct: DataStructure): any[] {
	// console.log(struct, data)
	if (!data) {
		console.error('restructureData() - No data provided')
		return []
	}
	if (!struct) {
		console.error('restructureData() - No data structure provided')
		return []
	}

	const table = []

	if (struct == 'A') {
		let i = 0
		for (const rowIndex in data) {
			const rowData = data[rowIndex]
			if (i === 0) table[0] = []
			table[i + 1] = []
			for (const key in rowData) {
				if (i === 0) table[i].push(key)
				table[i + 1].push(rowData[key])
			}
			i++
		}
	} else if (struct == 'B') {
		// Future other data structured go here.
	}

	return table
}
</script>

<style lang="scss" scoped>
table {
	border-collapse: collapse;
}
table th,
table td {
	border: 1px solid #ddd;
	padding: 4px;
	text-align: left;
}
table th {
	font-weight: bold;
	background: $black-03;
}
</style>
