<template>
	<h3>Display any molecule</h3>
	<br />
	<cv-radio-group legendText="Search options" :hideLegend="true" :onChange="resetInput">
		<cv-radio-button
			v-for="({ label, val }, index) in searchOptions"
			v-model="vModelSearchOption"
			:key="index"
			name="group-1"
			:label="label"
			:value="val"
			:hide-label="false"
			:label-left="false"
		/>
	</cv-radio-group>
	<br />

	<template v-if="['mol', 'smol'].includes(vModelSearchOption)">
		<p>
			Accepted identifiers are:
			<b><a href="#" @click.prevent="(e) => fillIn('inchi')">InChI</a></b>
			or <b><a href="#" @click.prevent="(e) => fillIn('smiles')">SMILES</a></b> and
			<b><a href="#" @click.prevent="(e) => fillIn('name')">name</a></b
			>, <b><a href="#" @click.prevent="(e) => fillIn('inchikey')">InChIKey</a></b> or
			<b><a href="#" @click.prevent="(e) => fillIn('cid')">PubChem CID</a></b> when a molecule is listed on PubChem.
		</p>
	</template>

	<template v-if="['mol', 'mmol'].includes(vModelSearchOption)">
		<p>
			Macromolecules can be found by their <b><a href="#" @click.prevent="(e) => fillIn('fasta')">FASTA sequence</a></b> or
			<b><a href="#" @click.prevent="(e) => fillIn('pdbId')">PDB id</a></b
			>.
		</p>
	</template>

	<form id="input-form" @submit.prevent="displayMol">
		<div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
		<div class="fields">
			<cv-text-input v-model="ipIdentifier" type="text" :placeholder="placeholder" :hide-label="true" />
			<cv-button size="default">Display</cv-button>
		</div>
	</form>
</template>

<script setup lang="ts">
// Vue
import { ref, computed } from 'vue'

// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Type declarations
import type { ComputedRef } from 'vue'

// Definitions
const ipIdentifier = ref<string>('')
const errorMsg = ref<string>('')
const vModelSearchOption = ref<string>('smol')
const searchOptions = [
	// {
	// 	label: 'All molecules',
	// 	val: 'mol',
	// },
	{
		label: 'Small molecules',
		val: 'smol',
	},
	{
		label: 'Macromolecules',
		val: 'mmol',
	},
]

/**
 * Computed
 */

const placeholder: ComputedRef<string> = computed(() => {
	switch (vModelSearchOption.value) {
		case 'smol':
			return 'InChI, SMILES, name, InChIKey or PubChem ID'
		case 'mmol':
			return 'FASTA sequence or PDB id'
		default:
			return 'Molecule identifier'
	}
})

/**
 * Methods
 */

// Pre-fill the input screen form.
function fillIn(idKey: string) {
	type Identifiers = {
		inchi: string
		smiles: string
		name: string
		inchikey: string
		cid: string
		[key: string]: string
	}

	const identifiers: Identifiers = {
		inchi: 'InChI=1S/C10H14O/c1-7-5-9(11)6-8(2)10(7,3)4/h5-6H,1-4H3',
		smiles: 'CC1=CC(=O)C=C(C1(C)C)C',
		name: 'penguinone',
		inchikey: 'RHIYIMQPIGYWEK-UHFFFAOYSA-N',
		cid: '681',
		//
		fasta: 'IINVKTSLKTIIKNALDKIQX',
		pdbId: '8t3n',
	}
	ipIdentifier.value = identifiers[idKey]
	errorMsg.value = ''
}

// Reset input
function resetInput() {
	ipIdentifier.value = ''
	errorMsg.value = ''
}

// Submit a molecule.
function displayMol() {
	if (ipIdentifier.value) {
		router.push({
			name: vModelSearchOption.value as 'smol' | 'mol',
			params: {
				identifier: ipIdentifier.value.toString(),
			},
		})
	} else {
		errorMsg.value = 'Please enter a molecule identifier.'
	}
}
</script>

<style lang="scss" scoped>
#input-form .fields {
	display: flex;
	gap: 8px;
}
#input-form .fields > div {
	flex: 1;
}
#input-form .fields > button {
	flex: 0;
}
#input-form .error-msg {
	margin-bottom: 10px;
}

// Carbon fix, cv-input is missing size parameter
#input-form .fields > div:deep(.bx--text-input) {
	height: 48px;
}
</style>
