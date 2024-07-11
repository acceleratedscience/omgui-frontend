<template>
	<cv-modal id="modal-save-file" :visible="modalStore.visible" size="lg" @primary-click="onSubmit" @modal-hidden="onExit">
		<template v-slot:title
			>Save to <b>{{ mainStore.workspace }}</b> Workspace</template
		>
		<template v-slot:content>
			<div class="flex-wrap-v">
				<div class="input-pad">
					<cv-text-input
						v-model="vmodelFilename"
						class="ip-filename"
						:hide-label="true"
						:invalid-message="filenameRequired"
					></cv-text-input>
					<div class="file-ext">
						<span>{{ vmodelFilename }}</span
						>.{{ ext }}
					</div>

					<!-- Save-as options for mol -->
					<cv-dropdown v-if="modalOptions.dataType == 'mol'" v-model="vModelOutputTypeMol" class="dd-output-options">
						<cv-dropdown-item v-for="(option, i) in outputTypeOptionsMol" :key="i" :value="option.val">{{
							option.disp
						}}</cv-dropdown-item>
					</cv-dropdown>

					<!-- Save-as options for molset -->
					<cv-dropdown v-if="modalOptions.dataType == 'molset'" v-model="vModelOutputTypeMolset" class="dd-output-options">
						<cv-dropdown-item v-for="(option, i) in outputTypeOptionsMolset" :key="i" :value="option.val">{{
							option.disp
						}}</cv-dropdown-item>
					</cv-dropdown>
				</div>
				<FileBrowser :isModal="true" v-model="vModelPath" />
			</div>
		</template>
		<template v-slot:secondary-button>Cancel</template>
		<template v-slot:primary-button>Save</template>
	</cv-modal>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, computed } from 'vue'

// Stores
import { useModalStore } from '@/stores/ModalStore'
import { useMainStore } from '@/stores/MainStore'
const modalStore = useModalStore()
const mainStore = useMainStore()

// Components
import FileBrowser from '@/viewers/FileBrowser.vue'

// Type declarations
import type { Ref, ComputedRef, WritableComputedRef } from 'vue'
type ModalOptions = {
	path?: string
	filename?: string

	// Filename extension.
	ext?: string
	ext2?: string // Secondary file extension, eg. foo.molset.json

	// When datatype is set, the dropdown with output options is shown.
	// Different output options are available per dataType.
	// When dataType is set, ext & ext2 are ignored.
	dataType?: 'mol' | 'molset' | null
}
type OutputTypesMol = 'mol.json' | 'mol' | 'csv' | 'smi'
type OutputTypesMolset = 'molset.json' | 'sdf' | 'csv' | 'smi'

// Emits
const emit = defineEmits(['mounted']) // <--

// Definitions
const isSubmitted = ref(false) // Workaround for Carbon dialog to make ESC or X trigger the onCancel event
const outputTypeOptionsMolset = [
	{ val: 'molset.json', disp: 'JSON' },
	{ val: 'sdf', disp: 'SDF' },
	{ val: 'csv', disp: 'CSV' },
	{ val: 'smi', disp: 'SMILES' },
]
const outputTypeOptionsMol = [
	{ val: 'mol.json', disp: 'JSON' },
	{ val: 'sdf', disp: 'SDF' },
	{ val: 'csv', disp: 'CSV' },
	{ val: 'mol', disp: 'MOL' },
	{ val: 'smi', disp: 'SMILES' },
]
const vModelOutputTypeMol: Ref<OutputTypesMol> = ref('mol.json')
const vModelOutputTypeMolset: Ref<OutputTypesMolset> = ref('molset.json')
const $ipFilename = ref<HTMLInputElement | null>(null)
const filenameRequired: Ref<string | null> = ref(null)

/*
 * Computed
 */

// Exposing the modal options that are otherwise
// hidden as anonymous data in the modalStore.
const modalOptions: ComputedRef<ModalOptions> = computed(() => modalStore.data ?? {})

// Model value for filename input.
const vmodelFilename: WritableComputedRef<string> = computed({
	get: () => modalOptions.value.filename ?? '',
	set: (newValue) => {
		filenameRequired.value = null
		modalStore.setData({ filename: newValue })
	},
})

// Model value for destination path.
const vModelPath: WritableComputedRef<string> = computed({
	get: () => modalOptions.value.path ?? '',
	set: (newValue) => modalStore.setData({ path: newValue }),
})

// File extension
const ext: ComputedRef<string> = computed(() => {
	if (modalOptions.value.dataType == 'mol') {
		return vModelOutputTypeMol.value
	} else if (modalOptions.value.dataType == 'molset') {
		return vModelOutputTypeMolset.value
	} else if (modalOptions.value.ext) {
		return (modalOptions.value.ext2 ? modalOptions.value.ext2 + '.' : '') + modalOptions.value.ext || ''
	} else {
		console.error('ModalSaveFile.vue: either ext or dataType must be set in the dialog options.')
		return ''
	}
})

/*
 * Hooks
 */

onMounted(() => {
	emit('mounted') // <--

	// Set the initial value for the output dropdown.
	if (modalOptions.value.dataType == 'mol') {
		vModelOutputTypeMol.value = 'mol.json'
	} else if (modalOptions.value.dataType == 'molset') {
		vModelOutputTypeMolset.value = 'molset.json'
	}

	// Select filename content.
	// Needs to wait until after the intro animation.
	setTimeout(() => {
		$ipFilename.value = document.querySelector('#modal-save-file input.bx--text-input')
		$ipFilename.value?.select()
	}, 350)
})

/*
 * Methods
 */

async function onSubmit() {
	// Error if no filename provided
	if (!vmodelFilename.value) {
		filenameRequired.value = 'Filename required.'
		$ipFilename.value?.focus()
		return
	}

	// The way how modal function data is passed via the modalStore state is a little convoluted,
	// but this basically triggers the onSubmit function that's passed as an option to the modal.
	// That's where destinationPath is consumed.
	// For example:	TheButtonSaveMolset.vue -> saveAsModal -> onSubmit()
	const path = vModelPath.value ? vModelPath.value + '/' : ''
	const destinationPath: string = path + vmodelFilename.value + '.' + ext.value
	if (modalStore.onSubmit) modalStore.onSubmit({ destinationPath, ext: ext.value })
	isSubmitted.value = true
}

async function onExit() {
	if (!isSubmitted.value && modalStore.onCancel) modalStore.onCancel()
}
</script>

<style lang="scss">
// Note: this CSS is not scoped because it's the only way to access the modal content.
// Instead everything is strictly namespaced to avoid conflicts.

// Layout
#modal-save-file .bx--modal-container {
	height: 100%;
}
#modal-save-file .bx--modal-content {
	margin-bottom: 0;
}
.flex-wrap-v {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

// Input
#modal-save-file .input-pad {
	position: relative;
	padding: 0 1rem;
	display: flex;
	gap: 8px;
}
#modal-save-file .ip-filename {
	flex: 1 1 auto;
}
#modal-save-file .ip-filename.bx--text-input.bx--text-input--invalid:focus,
#modal-save-file .ip-filename.bx--text-input.bx--text-input--invalid:active {
	// Carbn override
	outline: 2px solid $error;
}
#modal-save-file .dd-output-options {
	flex: 0 0 150px;
}
#modal-save-file .file-ext {
	position: absolute;
	left: 2rem;
	top: 0;
	height: 40px;
	line-height: 40px;
	color: $black-30;
	pointer-events: none;
	// border: solid 1px pink;
}
#modal-save-file .file-ext > span {
	opacity: 0;
}
// .cv-text-input {
// 	flex: 0;
// }
#col-scroll-x {
	/* flex: 1 1 300px; */
	background: white;
	height: calc(100% - 100px);
}
</style>
