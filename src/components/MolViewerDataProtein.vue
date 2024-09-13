<template>
	QQ
	<!-- prettier-ignore -->
	<div class="capitalize" v-html="proteinData?.name || `<div class='soft'>No description available</div>`"></div>

	<!-- mmol.json info -->
	<MmolDetails v-if="isMmolJsonFile" />

	<hr />

	<!-- Publication -->
	<div class="data-block">
		<h3>Publication</h3>

		<!-- Journal -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Journal: https://${journalLink}`" class="key">Journal</div>
			<template v-if="journalLink">
				<a :href="'https://' + journalLink" target="_blank" class="val">{{ journalLink }}</a>
			</template>
			<div v-else>-</div>
		</div>

		<!-- Authors -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Authors: ${authors?.join(', ')}`" class="key">Authors</div>
			<div v-if="authors && authors.length" class="val">
				<span v-for="(author, i) in authors" :key="i">
					<a :href="scholarSearch(author)" target="_blank" class="lookup">
						{{ author }}
					</a>
					<span v-if="authors && i < authors.length - 1">, </span>
				</span>
			</div>
			<div v-else>-</div>
		</div>

		<!-- Deposition and release dates -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Deposition Date: ${depositionDate || '-'}`" class="key">Deposition Date</div>
			<div v-copy-on-click class="val">{{ depositionDate || '-' }}</div>
		</div>
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Release Date: ${releaseDate || '-'}`" class="key">Release Date</div>
			<div v-copy-on-click class="val">{{ releaseDate || '-' }}</div>
		</div>

		<!-- Keywords -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Keywords: ${proteinData?.keywords || '-'}`" class="key">Keywords</div>
			<div v-copy-on-click class="val">{{ proteinData?.keywords || '-' }}</div>
		</div>
	</div>

	<hr />

	<!-- Context -->
	<div class="data-block">
		<h3>Data</h3>

		<!-- PDB Entry -->
		<div class="data-item">
			<div class="key">Protein Data Bank</div>
			<a v-if="proteinData?.idcode" :href="`https://www.rcsb.org/structure/${proteinData?.idcode}`" target="_blank" class="value">{{
				proteinData?.idcode
			}}</a>
			<div v-else>-</div>
		</div>

		<!-- FASTA -->
		<div class="data-item">
			<div class="key">Fasta</div>
			<template v-if="proteinData?.idcode">
				<a :href="`https://www.rcsb.org/fasta/entry/${proteinData?.idcode}/display`" target="_blank	" class="value">View</a>&nbsp;/&nbsp;
				<a :href="`https://www.rcsb.org/fasta/entry/${proteinData?.idcode}`" class="value">Download</a>
			</template>
			<div v-else>-</div>
		</div>

		<!-- Resolution -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Resolution: ${proteinData?.resolution || '-'}`" class="key">Resolution</div>
			<div class="value">{{ proteinData?.resolution || '-' }}</div>
		</div>

		<!-- Structure method -->
		<div class="data-item">
			<div v-copy-on-click :data-copy="`Structure method: ${proteinData?.structure_method || '-'}`" class="key">Structure method</div>
			<div class="value">{{ proteinData?.structure_method || '-' }}</div>
		</div>

		<!-- Structure reference -->
		<div class="data-item" :class="{ break: !!proteinData?.structure_reference && proteinData?.structure_reference.length }">
			<div class="key">Structure reference</div>
			<div class="value">
				<template v-if="structureReference">
					<ul>
						<li v-for="(ref, i) in structureReference" :key="i">
							<a :href="scholarSearch(ref.title)" target="_blank" class="title lookup">
								<div class="capitalize">{{ ref.title }}</div>
							</a>
							<template v-if="ref.pub">
								/ <a :href="scholarSearch(ref.pub)" target="_blank" class="title lookup">{{ ref.pub }}</a>
							</template>
							<div class="small soft">
								<!-- Authors -->
								<template v-for="(author, i) in ref.authors" :key="i">
									<a :href="scholarSearch(author)" target="_blank" class="lookup">
										{{ author }}
									</a>
									<span v-if="ref.authors && i < ref.authors.length - 1">, </span>
								</template>

								<!-- Other metadata -->
								<template v-if="ref.metaStr">{{ ref.metaStr }}</template>
								<template v-if="ref.input"><br />-- {{ ref.input }}</template>
							</div>
						</li>
					</ul>
				</template>
				<template v-else>-</template>
			</div>
		</div>

		<!-- Source -->
		<div class="data-item" :class="{ break: !!proteinData?.source }">
			<div class="key">Source</div>
			<div v-if="proteinData?.source" class="value">
				<TheTable :data="proteinData?.source" :allowCopy="true" />
			</div>
			<div v-else>-</div>
		</div>

		<!-- Biological matrix transformation -->
		<div class="data-item" :class="{ break: !!(biomoltrans && biomoltrans.length) }">
			<div class="key">Biological matrix transformation</div>
			<div class="value" v-if="biomoltrans && biomoltrans.length">
				<div v-for="(table, i) in biomoltrans" :key="i">
					Apply matrix to chains: {{ table.chains }}<br />
					<TheTable :data="table.matrix" :header="false" :allowCopy="true" />
				</div>
			</div>
			<div v-else>-</div>
		</div>

		<!-- Compound -->
		<div class="data-item" :class="{ break: !!proteinData?.compound }">
			<div class="key">Compound</div>
			<div class="value" v-if="proteinData?.compound">
				<TheTable :data="proteinData?.compound" :allowCopy="true" />
			</div>
			<div v-else>-</div>
		</div>

		<!-- Missing residues -->
		<div class="data-item" :class="{ break: !!proteinData?.has_missing_residues }">
			<div
				v-copy-on-click
				:data-copy="`Missing residues:\n${proteinData?.has_missing_residues ? proteinData?.missing_residues.join('\n') : '-'}`"
				class="key"
			>
				Missing residues
			</div>
			<div v-if="proteinData?.has_missing_residues" class="value">
				<TheTable :data="proteinData?.missing_residues" :allowCopy="true" />
			</div>
			<div v-else>-</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Vue
import { computed } from 'vue'

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

const isMmolJsonFile: ComputedRef<boolean> = computed(() => {
	return fileStore.ext == 'json' && fileStore.ext2 == 'mmol'
})

const proteinData: ComputedRef<Protein | null> = computed(() => molViewerStore.proteinData)

const journalLink: ComputedRef<string | null> = computed(() => {
	if (proteinData.value?.journal && proteinData.value.journal.indexOf('DOI ') != -1) {
		const splitValue = proteinData.value.journal.split('DOI ')
		const path = splitValue[1].trim()
		return 'doi.org/' + path
	} else {
		return null
	}
})

const authors: ComputedRef<string[] | null> = computed(() => {
	const authors = proteinData.value?.author
	if (authors) {
		return authors.split(',')
	} else {
		return null
	}
})

const depositionDate: ComputedRef<string | null> = computed(() => {
	const dateString = proteinData.value?.deposition_date
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

const releaseDate: ComputedRef<string | null> = computed(() => {
	const dateString = proteinData.value?.release_date
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

// Parse the structured reference strings into structured data.
const structureReference: ComputedRef<StructuredRef[] | null> = computed(() => {
	const references = proteinData.value?.structure_reference
	if (!proteinData.value?.structure_reference || !proteinData.value?.structure_reference.length) return null

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
	const input = proteinData.value?.biomoltrans
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
// Data blocks key/value pairs
.data-block .data-item {
	display: flex;
	flex-direction: row;
	margin-bottom: 4px;
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
	padding-left: 20px;
}

// Avoid links to fill page width
a > div.capitalize {
	display: inline-block;
}
</style>
