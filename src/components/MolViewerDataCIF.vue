<template>
	<!-- prettier-ignore -->
	<div class="capitalize" v-html="proteinDataHuman?.Structure?.Title || `<div class='soft'>No description available</div>`"></div>

	<hr />

	<!-- <pre>{{ proteinDataHuman }}</pre> -->

	<div class="data-block">
		<h3>Overview</h3>

		<!-- PDB Entry -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`PDB Entry: https://www.rcsb.org/structure/${pdbId}`" class="key">PDB Entry</div>
			<a v-if="pdbId" :href="`https://www.rcsb.org/structure/${pdbId}`" target="_blank">
				{{ pdbId }}
			</a>
			<div v-else>-</div>
		</div>

		<!-- DOI -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`DOI Entry: https://doi.org/${doiLink}`" class="key">DOI</div>
			<a v-if="doiLink" :href="`https://doi.org/${doiLink}`" target="_blank" class="val">{{ doiLink }}</a>
			<div v-else>-</div>
		</div>

		<!-- FASTA -->
		<div class="data-item">
			<div class="key">Fasta</div>
			<template v-if="pdbId">
				<a :href="`https://www.rcsb.org/fasta/entry/${pdbId}/display`" target="_blank	" class="value">View</a>&nbsp;/&nbsp;
				<a :href="`https://www.rcsb.org/fasta/entry/${pdbId}`" class="value">Download</a>
			</template>
			<div v-else>-</div>
		</div>

		<!-- Deposited -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Deposited: ${depositionDate}`" class="key">Deposited</div>
			<div class="val">{{ depositionDate || '-' }}</div>
		</div>

		<!-- Released -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Released: ${releaseDate}`" class="key">Released</div>
			<div class="val">{{ releaseDate || '-' }}</div>
		</div>

		<!-- Authors -->
		<div class="data-item inline">
			<div v-copy-on-click :data-copy="`Authors: ${authors?.join(', ') || '-'}`" class="key">Authors</div>
			<div v-if="authors && authors.length" class="val">
				<template v-for="(author, i) in authors" :key="i">
					<a :href="scholarSearch(author)" target="_blank" class="lookup">
						{{ author }}
					</a>
					<span v-if="authors && i < authors.length - 1">, </span>
				</template>
			</div>
			<div v-else>-</div>
		</div>

		<!-- Keywords -->
		<div class="data-item inline">
			<div v-copy-on-click :data-copy="`Keywords: ${keywords?.join(', ') || '-'}`" class="key">Keywords</div>
			<div v-if="keywords && keywords.length" class="val">
				<template v-for="(kw, i) in keywords" :key="i">
					<a :href="scholarSearch(kw)" target="_blank" class="lookup">
						{{ kw }}
					</a>
					<span v-if="i < keywords.length - 1">, </span>
				</template>
			</div>
			<div v-else>-</div>
		</div>
	</div>

	<!-- mmol.json info -->
	<MmolDetails v-if="isMmolJsonFile" />

	<hr />

	<!-- Publication -->
	<div class="data-block">
		<h3>Experimental Data Snapshot</h3>

		<!-- Method -->
		<div class="data-item">
			<div class="key">Method</div>
			<div class="value">{{ proteinDataHuman?.Experimental?.Method || '-' }}</div>
		</div>

		<!-- Resolution -->
		<div class="data-item">
			<div class="key">Resolution</div>
			<div class="value">{{ proteinData?.reflns_shell?.d_res_high || '-' }}</div>
		</div>

		<!-- R-Value Free -->
		<div class="data-item">
			<div class="key">R-Value Free</div>
			<div class="value">{{ proteinData?.refine?.ls_R_factor_R_free || '-' }}</div>
		</div>

		<!-- R-Value Work -->
		<div class="data-item">
			<div class="key">R-Value Work</div>
			<div class="value">{{ proteinData?.refine?.ls_R_factor_R_work || '-' }}</div>
		</div>

		<!-- R-Value Observed -->
		<div class="data-item">
			<div class="key">R-Value Observed</div>
			<div class="value">{{ proteinData?.refine?.ls_R_factor_obs || '-' }}</div>
		</div>
	</div>

	<hr />

	<!-- Validation report -->
	<div class="data-block" v-if="validationReportUrl">
		<h3>Validation Report</h3>
		<img id="validation-report" :src="validationReportUrl" alt="Validation report" />
	</div>
	<hr v-if="validationReportUrl" />

	<!-- Data dump -->
	<div class="data-block temp">
		<h3>Data</h3>
		<div v-for="(val, key) in proteinDataHuman" :key="key" class="data-item" :class="{ break: true }">
			<h4>{{ key }}</h4>

			<!-- Matrix data -->
			<div v-if="val.matrix && val.vector">
				<div class="matrix-wrap">
					<div class="small soft">Matrix</div>
					<TheTable :data="val.matrix" :allowCopy="true" :header="false" />

					<div class="small soft">Vector</div>
					<TheTable :data="[val.vector]" :allowCopy="true" :header="false" />
				</div>
			</div>

			<!-- Array with matrix data -->
			<div v-if="Array.isArray(val) && val[0].matrix && val[0].vector">
				<div v-for="(matrixObj, i) in val" :key="i" class="matrix-wrap-wrap">
					<div class="matrix-wrap">
						<h5 v-if="matrixObj.fields?.id">Matrix {{ matrixObj.fields.id }}</h5>
						<div v-for="(val, key) in matrixObj.fields" :key="key">
							<b>{{ key }}:</b> {{ val }}
						</div>
						<br v-if="Object.keys(matrixObj.fields).length" />

						<div class="small soft">Matrix</div>
						<TheTable :data="matrixObj.matrix" :allowCopy="true" :header="false" />

						<div class="small soft">Vector</div>
						<TheTable :data="[matrixObj.vector]" :allowCopy="true" :header="false" />
					</div>
				</div>
			</div>

			<!-- Table data -->
			<div v-else-if="Array.isArray(val)">
				<TheTable :data="val" :allowCopy="true" />
			</div>

			<!-- Value list -->
			<div v-else>
				<TheTable :data="val" :allowCopy="false" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { computed, onMounted } from 'vue'

// Type declarations
import type { Protein } from '@/types'
import type { ComputedRef } from 'vue'
type StructuredRef = {
	title: string | null
	authors: string[] | null
	//
	v: string | null
	issn: string | null
	pub: string | null
	//
	metaStr: string | null
	input: string
}

// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useFileStore } from '@/stores/FileStore'
const molViewerStore = useMolViewerStore()
const fileStore = useFileStore()

// Components
import TheTable from '@/components/TheTable.vue'
import MmolDetails from '@/components/MmolDetails.vue'

/*
 * Computed
 */

// Molecule data
// const protein: ComputedRef<Smol | TempSmol> = computed(() => molViewerStore.mol)

const isMmolJsonFile: ComputedRef<boolean> = computed(() => {
	return fileStore.ext == 'json' && fileStore.ext2 == 'mmol'
})

const proteinData: ComputedRef<{ [key: string]: any } | null> = computed(() => molViewerStore.proteinData)
const proteinDataHuman: ComputedRef<{ [key: string]: any } | null> = computed(() => molViewerStore.proteinDataHuman)
const proteinData_temp: ComputedRef<Protein | null> = computed(() => molViewerStore.mmol.header)

// PDB ID
const pdbId: ComputedRef<string | null> = computed(() => {
	return proteinData.value?.entry?.id || null
})

// DOI link
const doiLink: ComputedRef<string | null> = computed(() => {
	let db2 = proteinData.value?.database_2 ? proteinDataHuman.value!['Database 2'] : null
	if (db2) {
		for (let i = 0; i < db2.length; i++) {
			if (db2[i]['Database ID'] == 'Pdb') {
				return db2[i].Doi
			}
		}
	}
	return null
})

// Deposition data
const depositionDate: ComputedRef<string | null> = computed(() => {
	let dateString = proteinData.value?.pdbx_database_status?.recvd_initial_deposition_date || null
	console.log(88, proteinData.value)

	if (dateString) {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	} else {
		return null
	}
})

// Release date
const releaseDate: ComputedRef<string | null> = computed(() => {
	let revisionList = proteinData.value?.pdbx_audit_revision_history || null
	let dateString = revisionList ? revisionList[0]['revision_date'] : null

	if (dateString) {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	} else {
		return null
	}
})

// Authors
const authors: ComputedRef<string[]> = computed(() => {
	let authorList = proteinData.value?.audit_author ? proteinDataHuman.value!['Audit Author'] : null
	// Reformat names from Rowling, j.k. to J.K. Rowling
	authorList = authorList
		? authorList.map((auth: { [key: string]: string }) => {
				let name: string | string[] = auth.Name
				name = name.split(',').reverse()
				name = name.map((n: string) => n.trim())
				if (name[0].match(/^([a-zA-Z]\.)+$/)) name[0] = name[0].toUpperCase() // Make initials uppercase
				name = name.join(' ')
				return name
			})
		: []
	return authorList
})

// Keywords
const keywords: ComputedRef<string[] | null> = computed(() => {
	let kw = proteinData.value?.struct_keywords?.text ? proteinDataHuman.value!['Structure Keywords'].Text : null
	if (kw) {
		kw = kw.split(',')
		kw = kw.map((keyword: string) => keyword.trim())
	}
	return kw
})

// Validation report URL
const validationReportUrl: ComputedRef<string | null> = computed(() => {
	const entryId = proteinDataHuman.value?.Entry?.ID || null
	if (!entryId) return null
	const cat = entryId.slice(1, 3)
	return `https://files.rcsb.org/pub/pdb/validation_reports/${cat}/${entryId}/${entryId}_multipercentile_validation.png`
})

// Parse the structured reference strings into structured data.
const structureReference: ComputedRef<StructuredRef[] | null> = computed(() => {
	const references = proteinData_temp.value?.structure_reference
	if (!proteinData_temp.value?.structure_reference || !proteinData_temp.value?.structure_reference.length) return null

	const output = []
	if (references) {
		for (let i = 0; i < references.length; i++) {
			const _firstSpaceIdx = references[i].indexOf(' ')
			const _authorsStr = _firstSpaceIdx > -1 ? references[i].slice(0, _firstSpaceIdx) : null
			const _vIdx = references[i].indexOf(' v. ')
			const _end = _vIdx > -1 ? references[i].slice(_vIdx + 1).trim() : null
			const _issnIdx = _end?.indexOf(' issn ') || -1

			const title: string | null = _firstSpaceIdx > -1 && _vIdx > -1 ? references[i].slice(_firstSpaceIdx, _vIdx).trim() : null
			const authors: string[] | null = _authorsStr ? _authorsStr.split(',') : null
			const issn: string | null = _issnIdx > -1 ? _end?.slice(_issnIdx) || null : null
			let v: string | null = null
			let pub: string | null = null

			if (issn) {
				v = _end?.slice(0, _issnIdx) || null
			} else {
				const _endTrimmed = _end?.replace(/^v. /, '') || null
				const _firstLetterIdx = _endTrimmed ? _endTrimmed.search(/[a-zA-Z]/) : -1
				v = _end && _firstLetterIdx > -1 ? _end.slice(0, _firstLetterIdx + 3) : null
				pub = _endTrimmed && _firstLetterIdx > -1 ? _endTrimmed.slice(_firstLetterIdx) : null
			}

			// Meta string combining v, issn and pub
			let metaStr = [v, issn].filter((x) => x).join(' / ')
			metaStr = metaStr ? ' / ' + metaStr : ''

			// Output format
			output.push({
				title,
				authors,
				//
				v,
				issn,
				pub,
				//
				metaStr,
				input: references[i],
			})
		}
		return output
	} else {
		return null
	}
})

const biomoltrans: ComputedRef<any> = computed(() => {
	const input = proteinData_temp.value?.biomoltrans
	const allTables = []
	// console.log(999, input)
	if (input) {
		for (const key in input) {
			const table: { chains: string; matrix: string[] } = {
				chains: '',
				matrix: [],
			}
			let i = 0
			const data = input[key]
			for (const key in data) {
				key // To shut up ts linter
				if (i == 0) {
					table.chains = data[i].join(', ')
				} else if (typeof data[i] == 'string') {
					const rowArray = data[i].trim().split(/\s+/)
					table.matrix.push(rowArray)
				}
				i++
			}
			allTables.push(table)
		}
	}
	return allTables
})

/*
 * Hooks
 */

/*
 * Methods
 */

async function copyTextFileToClipboard() {
	const url = 'https://www.rcsb.org/fasta/entry/8K1G/display'
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const text = await response.text()
		await navigator.clipboard.writeText(text)
		alert('Text file content copied to clipboard!')
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error)
		alert('Failed to copy text file content to clipboard.')
	}
}

function scholarSearch(str: string | null): string {
	return str ? 'https://scholar.google.com/scholar?q=' + str.replace(/\s/g, '+') : ''
}
</script>

<style lang="scss" scoped>
#validation-report {
	width: 100%;
	max-width: 600px;
	height: auto;
	padding: 32px;
	background: $black-03;
	border: solid 1px $black-05;
}

// Data blocks key/value pairs
.data-block .data-item {
	display: flex;
	flex-direction: row;
	margin-bottom: 4px;
}
.data-block .data-item.inline {
	display: block;
}
.data-block .data-item.inline > div {
	display: inline;
}
.data-block .data-item.break {
	flex-direction: column;
}
.data-block .data-item .key {
	font-weight: bold;
}
.data-block .data-item .key::after {
	content: ':\00A0';
}
.data-block .data-item .value table {
	margin: 4px 0;
}
.data-block .data-item .value ul {
	margin: 4px 0;
	padding-left: 20px;
}
.data-block .data-item.break .value {
	margin: 4px 0;
	// padding-left: 20px;
}

/**
 * Data dump section
 */

.data-block h4 {
	margin-top: 32px;
	margin-bottom: 8px;
}
.data-block .matrix-wrap-wrap:not(:first-child) {
	margin-top: 40px;
}

// Matrix displays
.data-block .matrix-wrap {
	display: inline-block;
}
.data-block .matrix-wrap table {
	width: 100%;
}
.data-block .matrix-wrap .small {
	margin-bottom: 4px;
}
.data-block .matrix-wrap .small:last-of-type {
	margin-top: 8px;
}

// Avoid links to fill page width
a > div.capitalize {
	display: inline-block;
}

// .data-block:not(.temp) {
// 	display: none;
// }
</style>
