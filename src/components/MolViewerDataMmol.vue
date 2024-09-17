<template>
	<!-- prettier-ignore -->
	<div class="capitalize" v-html="mmolDataHuman?.Structure?.Title || `<div class='soft'>No description available</div>`"></div>

	<hr />

	<div class="data-block">
		<h3>Overview</h3>

		<!-- PDB Entry -->
		<div class="key-val">
			<div v-copy-on-click :data-copy="`PDB Entry: https://www.rcsb.org/structure/${pdbId}`">PDB Entry</div>
			<a v-if="pdbId" :href="`https://www.rcsb.org/structure/${pdbId}`" target="_blank">
				{{ pdbId }}
			</a>
			<div v-else>-</div>
		</div>

		<!-- DOI -->
		<div class="key-val">
			<div v-copy-on-click :data-copy="`DOI Entry: https://doi.org/${doiLink}`">DOI</div>
			<a v-if="doiLink" :href="`https://doi.org/${doiLink}`" target="_blank">{{ doiLink }}</a>
			<div v-else>-</div>
		</div>

		<!-- FASTA -->
		<div class="key-val">
			<div>FASTA</div>
			<template v-if="pdbId">
				<a :href="`https://www.rcsb.org/fasta/entry/${pdbId}/display`" target="_blank">View</a>&nbsp;/&nbsp;
				<a :href="`https://www.rcsb.org/fasta/entry/${pdbId}`">Download</a>
			</template>
			<div v-else>-</div>
		</div>

		<!-- Deposited -->
		<div class="key-val">
			<div v-copy-on-click :data-copy="`Deposited: ${depositionDate}`">Deposited</div>
			<div>{{ depositionDate || '-' }}</div>
		</div>

		<!-- Released -->
		<div class="key-val">
			<div v-copy-on-click :data-copy="`Released: ${releaseDate}`">Released</div>
			<div>{{ releaseDate || '-' }}</div>
		</div>

		<!-- Authors -->
		<div class="key-val inline">
			<div v-copy-on-click :data-copy="`Authors: ${authors?.join(', ') || '-'}`">Authors</div>
			<div v-if="authors && authors.length">
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
		<div class="key-val inline">
			<div v-copy-on-click :data-copy="`Keywords: ${keywords?.join(', ') || '-'}`">Keywords</div>
			<div v-if="keywords && keywords.length">
				<template v-for="(kw, i) in keywords" :key="i">
					<a :href="scholarSearch(kw)" target="_blank" class="lookup">
						{{ kw }}
					</a>
					<span v-if="i < keywords.length - 1">, </span>
				</template>
			</div>
			<div v-else>-</div>
		</div>

		<!-- 3D data format -->
		<div v-if="isMmolJsonFile" class="key-val">
			<div v-copy-on-click :data-copy="`PDB Entry: https://www.rcsb.org/structure/${pdbId}`">3D Data</div>
			<div>{{ molViewerStore.mmolData3DFormat }}</div>
		</div>
	</div>

	<hr />

	<!-- Publication -->
	<div class="data-block">
		<h3>Experimental Data Snapshot</h3>

		<!-- Method -->
		<div class="key-val">
			<div>Method</div>
			<div>{{ mmolDataHuman?.Experimental?.Method || '-' }}</div>
		</div>

		<!-- Resolution -->
		<div class="key-val">
			<div>Resolution</div>
			<div>{{ mmolData?.reflns_shell?.d_res_high || '-' }}</div>
		</div>

		<!-- R-Value Free -->
		<div class="key-val">
			<div>R-Value Free</div>
			<div>{{ mmolData?.refine?.ls_R_factor_R_free || '-' }}</div>
		</div>

		<!-- R-Value Work -->
		<div class="key-val">
			<div>R-Value Work</div>
			<div>{{ mmolData?.refine?.ls_R_factor_R_work || '-' }}</div>
		</div>

		<!-- R-Value Observed -->
		<div class="key-val">
			<div>R-Value Observed</div>
			<div>{{ mmolData?.refine?.ls_R_factor_obs || '-' }}</div>
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
		<h3>Meta Data</h3>
		<template v-for="(val, key) in mmolDataHuman" :key="key">
			<details v-if="Object.keys(val).length">
				<summary>
					<h4>{{ key }}<a :href="'#' + molViewerStore.mmolDataKeyMap[key]" :name="molViewerStore.mmolDataKeyMap[key]">#</a></h4>
				</summary>
				<div>
					<!-- Matrix data -->
					<MolViewerDataMmolMatrices
						v-if="(val.matrices && val.vectors) || (Array.isArray(val) && val[0].matrices && val[0].vectors)"
						:data="val"
					/>

					<!-- Table data -->
					<div v-else-if="Array.isArray(val)">
						<TheTable :data="val" :allowCopy="true" />
					</div>

					<!-- Value list -->
					<div v-else>
						<TheTable :data="val" :allowCopy="false" />
					</div>
				</div>
			</details>
		</template>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, onMounted } from 'vue'

// Type declarations
import type { ComputedRef } from 'vue'

// Stores
import { useMolViewerStore } from '@/stores/MolViewerStore'
import { useFileStore } from '@/stores/FileStore'
const molViewerStore = useMolViewerStore()
const fileStore = useFileStore()

// Components
import TheTable from '@/components/TheTable.vue'
import MolViewerDataMmolMatrices from '@/components/MolViewerDataMmolMatrices.vue'

/*
 * Computed
 */

const isMmolJsonFile: ComputedRef<boolean> = computed(() => {
	return fileStore.ext == 'json' && fileStore.ext2 == 'mmol'
})

const mmolData: ComputedRef<{ [key: string]: any } | null> = computed(() => molViewerStore.mmolData)
const mmolDataHuman: ComputedRef<{ [key: string]: any } | null> = computed(() => molViewerStore.mmolDataHuman)

// PDB ID
const pdbId: ComputedRef<string | null> = computed(() => {
	return mmolData.value?.entry?.id || null
})

// DOI link
const doiLink: ComputedRef<string | null> = computed(() => {
	let db2 = mmolData.value?.database_2 ? mmolDataHuman.value!['Database 2'] : null
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
	let dateString = mmolData.value?.pdbx_database_status?.recvd_initial_deposition_date || null

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
	const revisions = mmolData.value?.pdbx_audit_revision_history || null
	if (!revisions) return null
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
	const authors = mmolData.value?.audit_author ? mmolDataHuman.value!['Audit Author'] : null
	if (!authors) return []
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
	let kw = mmolData.value?.struct_keywords?.text ? mmolDataHuman.value!['Structure Keywords'].Text : null
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

/*
 * Hooks
 */

onMounted(() => {
	const hash = window.location.hash
	window.location.hash = ''
	setTimeout(() => {
		jumpToHash(hash)
	}, 1)
})

function jumpToHash(hash: string) {
	if (!hash) return
	window.location.hash = hash
	const link: HTMLAnchorElement | null = document.querySelector(`a[href="${hash}"]`)
	const details = link?.closest('details')
	if (details) details.setAttribute('open', 'true')
	link?.blur()
}

/*
 * Methods
 */

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
.data-block .key-val {
	display: flex;
	flex-direction: row;
	margin-bottom: 4px;
}
.data-block .key-val.inline {
	display: block;
}
.data-block .key-val.inline > div {
	display: inline;
}
.data-block .key-val > div:first-child {
	font-weight: bold;
}
.data-block .key-val > div:first-child::after {
	content: ':\00A0';
}

/**
 * Data dump section
 */

.data-block details {
	margin: 1rem 0;
}

// Matrix
h4 + :deep() .matrix-wrap-wrap {
	margin-top: 0;
}

// Avoid links to fill page width
a > div.capitalize {
	display: inline-block;
}
</style>
