<template>
	<h3>Display any molecule</h3>
	<p>
		Accepted identifiers are:
		<b><a href="#" @click.prevent="(e) => fillIn('inchi')">InChI</a></b>
		or <b><a href="#" @click.prevent="(e) => fillIn('smiles')">SMILES</a></b
		>.<br />
		When a molecule is listed on PubChem, you can also use its
		<b><a href="#" @click.prevent="(e) => fillIn('name')">name</a></b
		>, <b><a href="#" @click.prevent="(e) => fillIn('inchikey')">InChIKey</a></b> or
		<b><a href="#" @click.prevent="(e) => fillIn('pid')">PID</a></b
		>.
	</p>
	<form id="input-form" @submit.prevent="displayMol">
		<div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
		<div class="fields">
			<cv-text-input
				v-model="ipIdentifier"
				type="text"
				placeholder="dopamine"
				:hide-label="true"
			/>
			<cv-button size="default">Display</cv-button>
		</div>
	</form>
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue'

// Router
import { useRouter } from 'vue-router'
const router = useRouter()

// Definitions
const ipIdentifier = ref<String>('')
const errorMsg = ref<String>('')

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
		pid: string
		[key: string]: string
	}

	const identifiers: Identifiers = {
		inchi: 'InChI=1S/C10H14O/c1-7-5-9(11)6-8(2)10(7,3)4/h5-6H,1-4H3',
		smiles: 'CC1=CC(=O)C=C(C1(C)C)C',
		name: 'penguinone',
		inchikey: 'RHIYIMQPIGYWEK-UHFFFAOYSA-N',
		pid: '12564106',
	}
	ipIdentifier.value = identifiers[idKey]
	errorMsg.value = ''
}

// Submit a molecule.
function displayMol() {
	if (ipIdentifier.value) {
		router.push({
			name: 'molviewer',
			params: { identifier: ipIdentifier.value.toString() },
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
