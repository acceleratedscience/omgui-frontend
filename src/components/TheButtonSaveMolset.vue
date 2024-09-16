<template>
	<div class="btn-wrap">
		<cv-button
			ref="$btn"
			size="field"
			@click="save"
			:disabled="props.disabled && !success"
			:class="{ loading, error, success: success }"
			:style="styleButton"
			:icon="error ? ErrorFilled : success ? CheckmarkFilled : null"
			>{{ btnText }}</cv-button
		>
		<select v-if="isNonJSONFile" v-model="vModelSaveType">
			<option value="" hidden></option>
			<option value="as-molset">Save as molset JSON</option>
			<option value="update-original">Update original {{ molGridStore.context?.split('-')[0].toUpperCase() }}</option>
		</select>
	</div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, watch, onMounted } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// Stores
import { useMolGridStore } from '@/stores/MolGridStore'
import { useModalStore } from '@/stores/ModalStore'
import { useFileStore } from '@/stores/FileStore'
const molGridStore = useMolGridStore()
const modalStore = useModalStore()
const fileStore = useFileStore()

// Modals
import { useModalSaveFile } from '@/modals/modal-save-file'
const modalSaveFile = useModalSaveFile()

// Components
// @ts-ignore
import CheckmarkFilled from '@carbon/icons-vue/es/checkmark--filled/16'
// @ts-ignore
import ErrorFilled from '@carbon/icons-vue/es/error--filled/16'

// Utils
import { path2FileBrowserPath } from '@/utils/helpers'

// Type declarations
import type { ComponentPublicInstance } from 'vue'
type SaveType = 'as-molset' | 'update-original' | ''

// Definitions
const btnText = ['result-mols', 'my-mols'].includes(molGridStore.context || '') ? 'Update' : 'Save'
const loading = ref<boolean>(false)
const error = ref<boolean>(false)
const success = ref<boolean>(false)
const $btn = ref<ComponentPublicInstance | null>(null)
const fixWidth = ref<number | null>(null)
//
const vModelSaveType = ref<SaveType>('')

// Props
const props = withDefaults(
	defineProps<{
		disabled?: boolean
	}>(),
	{ disabled: false },
)

/**
 * Computed
 */

const isNonJSONFile = computed(() => molGridStore.context?.match(/-file$/))

const styleButton = computed(() => (fixWidth.value ? { width: fixWidth.value + 'px' } : {}))

/**
 * Hooks
 */

watch(vModelSaveType, (newVal) => {
	if (newVal) save(newVal)
	setTimeout(() => (vModelSaveType.value = ''), 1)
})

/**
 * Methods
 */

async function save(saveType: SaveType) {
	// console.log('execSave >>')
	loading.value = true
	fixWidth.value = $btn.value?.$el?.offsetWidth ?? null
	try {
		let submitted: boolean = false
		if (isNonJSONFile.value) {
			// Double-option save button for non-JSON files.
			if (saveType == 'as-molset') {
				submitted = await modalSaveFile('molset', false) // --> Saves as new molset.json file
			} else if (saveType == 'update-original') {
				submitted = await updateOriginal() // --> Saves to non-json source file (SDF/CSV/...)
			}
		} else {
			// Singular save button to update the source.
			// Used everywhere else.
			submitted = await executeSave() // --> Updates the source, either molset.json, memory or my-mols
		}
		// console.log('<< execSave')
		loading.value = false
		if (submitted) {
			success.value = true
			setTimeout(() => {
				success.value = false
			}, 2000)
		}
	} catch (err) {
		console.error(err)
		loading.value = false
		error.value = true
		setTimeout(() => {
			error.value = false
		}, 2000)
	}
}

function executeSave(): Promise<boolean> {
	if (molGridStore.context == 'json') {
		return molGridStore.updateMolset()
	} else if (molGridStore.context == 'my-mols') {
		return molGridStore.updateMolset_mymols()
	} else if (molGridStore.context == 'result-mols') {
		return molGridStore.updateMolset_result()
	} else if (molGridStore.context == 'dataframe') {
		const dfName: string = route.params.dfName as string
		return molGridStore.updateMolset_dataframe(dfName)
	}
	return Promise.resolve(false)
}

async function updateOriginal(): Promise<boolean> {
	if (molGridStore.context == 'sdf-file') {
		// Save changes to the orignal SDF file that we're viewing.
		return molGridStore.saveMolsetAsSDF(fileStore.path, { newFile: false })
	} else if (molGridStore.context == 'csv-file') {
		// Save changes to the orignal CSV file that we're viewing.
		return molGridStore.saveMolsetAsCSV(fileStore.path, { newFile: false })
	} else if (molGridStore.context == 'smi-file') {
		// Save changes to the orignal SMILES file that we're viewing.
		return molGridStore.saveMolsetAsSmiles(fileStore.path, { newFile: false })
	}
	return Promise.resolve(false)
}
</script>

<style lang="scss" scoped>
.btn-wrap {
	position: relative;
}
.btn-wrap select {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
}

.bx--btn.loading::after {
	content: '';
	animation: ellipsis 800ms infinite;
}
.bx--btn.loading {
	// animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
}
.bx--btn.error {
	background: $error;
	color: white;
}
.bx--btn.success {
	background: $success;
	color: white;
}
</style>
