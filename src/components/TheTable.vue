<template>
	<div ref="overflowWrap" class="table-overflow-wrap" :class="{ inline: inline }">
		<table v-copy-on-click="allowCopy" :data-copy="allowCopy ? copyData : null" :class="{ 'key-val': dataStructure == 'B' }">
			<thead v-if="header">
				<tr>
					<th v-for="(cell, i) in table.header" :key="i">
						<span :class="{ soft: !cell }">{{ cell || '-' }}</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, i) in table.body" :key="i">
					<!-- Title tooltip only shows approximately when text requires truncation -->
					<td v-for="(cell, j) in row" :key="j" :title="dataStructure == 'B' && String(cell).length > 20 ? String(cell) : ''">
						<a v-if="cell && typeof cell == 'string' && cell.match(/^http(s)?:\/\//)" :href="cell" target="_blank">{{ cell }}</a>
						<span
							v-else
							v-copy-on-click="dataStructure == 'B'"
							:data-copy="j == 0 ? `${cell}: ${row[1]}` : j == 1 ? cell : null"
							:class="{ soft: !cell }"
						>
							{{ cell || '-' }}
						</span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue'

// Type declarations
import type { ComputedRef } from 'vue'
type DataStructure = 'A' | 'B' | null
type Table = {
	header: (string | number)[]
	body: (string | number)[][]
}

// Definitions
const overflowWrap = ref<HTMLElement | null>(null)

// Props
const props = withDefaults(
	defineProps<{
		data: any
		// Lets the table stick to minimum required width
		// and disables the overflow scroll behavior.
		inline?: boolean
		header?: boolean
		allowCopy?: boolean
	}>(),
	{
		inline: false,
		header: true,
		allowCopy: false,
	},
)

/*
 * Computed
 */

// Objects structure
const dataStructure: ComputedRef<DataStructure> = computed(() => {
	if (typeof props.data == 'object' && props.data !== null) {
		let i = 0
		let isArrayObject = true
		for (const key in props.data) {
			if (+key !== i) {
				isArrayObject = false
				break
			}
			i++
		}
		return isArrayObject ? 'A' : 'B'
	}
	return null
})

const data: ComputedRef<any> = computed(() => {
	return restructureData(props.data, dataStructure.value)
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
	const output: Table = {
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
 * Methods
 */

// Restructure a data object into an array of arrays.
//
// Input data structure A (array object):
// Input: { 0: { key1: 'foo', key2: 'bar' }, 1: { key1: 'goo', key2: 'car' } }
// Output: [ ['key1', 'key2'], ['foo', 'bar'], ['goo', 'car'] ]
//
// Input data structure B (object):
// Input: { foo: 1, bar: 2  }
// Output: [ ['foo', 1], ['bar', 2] ]
//
// Input data structure C:
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

	const table: any[] = []

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
		let i = 0
		for (const key in data) {
			if (i === 0) table[0] = []
			table[i + 1] = [key, data[key]]
			i++
		}
	} else if (struct == 'C') {
		// Future other data structured go here.
	}

	return table
}

// // Unused: Style table when it requires scrolling.
// import { onMounted, onBeforeUnmount } from 'vue'
// onMounted(() => {
// 	checkOverflow()
// 	window.addEventListener('resize', checkOverflow)
// })
// onBeforeUnmount(() => {
// 	window.removeEventListener('resize', checkOverflow)
// })
// function checkOverflow() {
// 	if (!overflowWrap.value) return
// 	if (overflowWrap.value.scrollWidth > overflowWrap.value.clientWidth) {
// 		overflowWrap.value.classList.add('has-overflow')
// 	} else {
// 		overflowWrap.value.classList.remove('has-overflow')
// 	}
// }
</script>

<style lang="scss" scoped>
.table-overflow-wrap {
	overflow-x: auto;
	position: relative;
}
table {
	border-collapse: collapse;
	width: 100%;
}
table th,
table td {
	border: 1px solid $black-10;
	padding: 4px;
	text-align: left;
	min-width: 40px;
}
table th {
	font-weight: bold;
	background: $black-03;
}

// Key-value table has left column bold/gray
table.key-val td:first-child {
	font-weight: bold;
	background: $black-03;
	width: 1px;
	max-width: 200px;

	// Truncate
	word-wrap: normal;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
table.key-val td:not(:first-child) {
	width: auto;
}

/**
 * Responsive
 * - - -
 * When the table is taking up the full screen width, the overflow wrapper
 * will take on the width of the entire screen instead of the content area.
 * This way the table will scroll more elegantly off screen, but to achieve
 * this, the values below need to stay in sync with the margin of the main-wrap.
 */

@media (max-width: $bp-xlarge) {
	.table-overflow-wrap:not(.inline) {
		margin-left: -80px;
		padding-left: 80px;
		margin-right: -80px;
		padding-right: 80px;
	}
}
@media (max-width: $bp-medium) {
	.table-overflow-wrap:not(.inline) {
		margin-left: -40px;
		padding-left: 40px;
		margin-right: -40px;
		padding-right: 40px;
	}
}
@media (max-width: $bp-small) {
	.table-overflow-wrap:not(.inline) {
		margin-left: -20px;
		padding-left: 20px;
		margin-right: -20px;
		padding-right: 20px;
	}
}
</style>
