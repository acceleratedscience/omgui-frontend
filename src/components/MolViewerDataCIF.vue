<template>
	<!-- prettier-ignore -->
	<div class="capitalize" v-html="proteinDataHuman?.Structure?.Title || `<div class='soft'>No description available</div>`"></div>

	<br />

	<!-- <pre>{{ sections }}</pre> -->

	<!-- Index dropdown -->
	<cv-dropdown id="dd-sections" v-model="sectionsSel" @change="onSectionChange">
		<cv-dropdown-item value="-" hidden>Jump to section</cv-dropdown-item>
		<cv-dropdown-item v-for="(item, i) in sections" :key="i" :value="item.key">
			{{ item.humanKey }}
		</cv-dropdown-item>
	</cv-dropdown>

	<hr />

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
	<div class="data-block">
		<h3>Data</h3>
		<template v-for="(val, key) in proteinDataHuman" :key="key">
			<div v-if="Object.keys(val).length" class="data-item" :class="{ break: true }">
				<h4>
					<a :href="'#' + molViewerStore.proteinDataKeyMap[key]" :name="molViewerStore.proteinDataKeyMap[key]" class="anchor">{{ key }}</a>
				</h4>

				<!-- Matrix data -->
				<!-- Example: /mmol/2G64#database_PDB_matrix -->
				<!-- Example with multiple matrices -->
				<div v-if="val.matrices && val.vectors">
					<div v-for="(v, k) in val.fields" :key="k">
						• <b>{{ k }}:</b> {{ v }}
					</div>
					<div v-for="(matrix, mtxName) in val.matrices" :key="mtxName">
						<div class="matrix-wrap">
							<br v-if="Object.keys(val.fields).length" />
							<div class="small soft">
								Matrix<template v-if="String(mtxName) != '_'"> - {{ mtxName }}</template>
							</div>
							<TheTable :data="matrix" :allowCopy="true" :header="false" />

							<div class="small soft vector">
								Vector<template v-if="String(mtxName) != '_'"> - {{ mtxName }}</template>
							</div>
							<TheTable :data="[val.vectors[mtxName]]" :allowCopy="true" :header="false" />
						</div>
					</div>
				</div>

				<!-- Array with matrix data -->
				<!-- Example: /mmol/2g64#pdbx_struct_oper_list -->
				<div v-else-if="Array.isArray(val) && val[0].matrices && val[0].vectors">
					<!-- <pre>{{ val }}</pre> -->
					<div v-for="(matrixObj, i) in val" :key="i" class="matrix-wrap-wrap">
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
		</template>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, onMounted } from 'vue'

// Type declarations
import type { ComputedRef } from 'vue'

// trash
// import type { Protein } from '@/types'
// type StructuredRef = {
// 	title: string | null
// 	authors: string[] | null
// 	//
// 	v: string | null
// 	issn: string | null
// 	pub: string | null
// 	//
// 	metaStr: string | null
// 	input: string
// }

// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useFileStore } from '@/stores/FileStore'
const molViewerStore = useMolViewerStore()
const fileStore = useFileStore()

// Components
import TheTable from '@/components/TheTable.vue'
import MmolDetails from '@/components/MmolDetails.vue'

// Definitions
const sectionsSel = ref<string | null>('-')

/*
 * Computed
 */

// Data sections
const sections: ComputedRef<{ key: string; humanKey: string }[]> = computed(() => {
	if (!molViewerStore.proteinData || !molViewerStore.proteinDataHuman) return []
	const keys = Object.keys(molViewerStore.proteinData)
	const humanKeys = Object.keys(molViewerStore.proteinDataHuman)
	const output = []
	for (let i = 0; i < keys.length; i++) {
		const section = {
			key: keys[i],
			humanKey: humanKeys[i],
		}
		output.push(section)
	}
	return output
})

const isMmolJsonFile: ComputedRef<boolean> = computed(() => {
	return fileStore.ext == 'json' && fileStore.ext2 == 'mmol'
})

const proteinData: ComputedRef<{ [key: string]: any } | null> = computed(() => molViewerStore.proteinData)
const proteinDataHuman: ComputedRef<{ [key: string]: any } | null> = computed(() => molViewerStore.proteinDataHuman)
// const proteinData_temp: ComputedRef<Protein | null> = computed(() => molViewerStore.mmol.header)

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
	const revisions = proteinData.value?.pdbx_audit_revision_history || null
	const revisionList = Array.isArray(revisions) ? revisions : [revisions]
	let dateString = revisionList ? revisionList[0]['revision_date'] : null

	// Humanize date string
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
	const authors = proteinData.value?.audit_author ? proteinDataHuman.value!['Audit Author'] : null
	let authorList = Array.isArray(authors) ? authors : [authors]

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
	if (!pdbId.value) return null
	const id = pdbId.value.toLowerCase()
	const cat = id.slice(1, 3)
	return `https://files.rcsb.org/pub/pdb/validation_reports/${cat}/${id}/${id}_multipercentile_validation.png`
})

// trash
// // Parse the structured reference strings into structured data.
// const structureReference: ComputedRef<StructuredRef[] | null> = computed(() => {
// 	const references = proteinData_temp.value?.structure_reference
// 	if (!proteinData_temp.value?.structure_reference || !proteinData_temp.value?.structure_reference.length) return null

// 	const output = []
// 	if (references) {
// 		for (let i = 0; i < references.length; i++) {
// 			const _firstSpaceIdx = references[i].indexOf(' ')
// 			const _authorsStr = _firstSpaceIdx > -1 ? references[i].slice(0, _firstSpaceIdx) : null
// 			const _vIdx = references[i].indexOf(' v. ')
// 			const _end = _vIdx > -1 ? references[i].slice(_vIdx + 1).trim() : null
// 			const _issnIdx = _end?.indexOf(' issn ') || -1

// 			const title: string | null = _firstSpaceIdx > -1 && _vIdx > -1 ? references[i].slice(_firstSpaceIdx, _vIdx).trim() : null
// 			const authors: string[] | null = _authorsStr ? _authorsStr.split(',') : null
// 			const issn: string | null = _issnIdx > -1 ? _end?.slice(_issnIdx) || null : null
// 			let v: string | null = null
// 			let pub: string | null = null

// 			if (issn) {
// 				v = _end?.slice(0, _issnIdx) || null
// 			} else {
// 				const _endTrimmed = _end?.replace(/^v. /, '') || null
// 				const _firstLetterIdx = _endTrimmed ? _endTrimmed.search(/[a-zA-Z]/) : -1
// 				v = _end && _firstLetterIdx > -1 ? _end.slice(0, _firstLetterIdx + 3) : null
// 				pub = _endTrimmed && _firstLetterIdx > -1 ? _endTrimmed.slice(_firstLetterIdx) : null
// 			}

// 			// Meta string combining v, issn and pub
// 			let metaStr = [v, issn].filter((x) => x).join(' / ')
// 			metaStr = metaStr ? ' / ' + metaStr : ''

// 			// Output format
// 			output.push({
// 				title,
// 				authors,
// 				//
// 				v,
// 				issn,
// 				pub,
// 				//
// 				metaStr,
// 				input: references[i],
// 			})
// 		}
// 		return output
// 	} else {
// 		return null
// 	}
// })

// const biomoltrans: ComputedRef<any> = computed(() => {
// 	const input = proteinData_temp.value?.biomoltrans
// 	const allTables = []
// 	// console.log(999, input)
// 	if (input) {
// 		for (const key in input) {
// 			const table: { chains: string; matrix: string[] } = {
// 				chains: '',
// 				matrix: [],
// 			}
// 			let i = 0
// 			const data = input[key]
// 			for (const key in data) {
// 				key // To shut up ts linter
// 				if (i == 0) {
// 					table.chains = data[i].join(', ')
// 				} else if (typeof data[i] == 'string') {
// 					const rowArray = data[i].trim().split(/\s+/)
// 					table.matrix.push(rowArray)
// 				}
// 				i++
// 			}
// 			allTables.push(table)
// 		}
// 	}
// 	return allTables
// })

/*
 * Hooks
 */

onMounted(() => {
	const hash = window.location.hash
	window.location.hash = ''
	setTimeout(() => {
		window.location.hash = hash
	}, 1)
})

/*
 * Methods
 */

function onSectionChange(section: string) {
	window.location.hash = '#' + section
	setTimeout(() => {
		history.replaceState(null, '', ' ')
		sectionsSel.value = '-'
	}, 0)
}

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
#dd-sections {
	max-width: 250px;
}

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
.data-block .matrix-wrap:deep() table {
	width: 100%;
}
.data-block .matrix-wrap .small {
	margin-bottom: 4px;
}
.data-block .matrix-wrap .small.vector {
	margin-top: 8px;
}

// Avoid links to fill page width
a > div.capitalize {
	display: inline-block;
}

/**
 * Responsive
 */

@media (max-width: $bp-small) {
	#dd-sections {
		max-width: none;
	}
}
</style>
