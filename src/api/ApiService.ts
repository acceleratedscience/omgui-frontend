import type { Ref } from 'vue'

import FileSystemApi from '@/api/FileSystemApi'
import MoleculesApi from '@/api/MoleculesApi'
import MainApi from '@/api/MainApi'

export const fileSystemApi = new FileSystemApi()
export const moleculesApi = new MoleculesApi()
export const mainApi = new MainApi()

type FetchOptions = {
	onSuccess?: ((response: any) => void) | null
	onError?: ((error: any) => void) | null
	loading?: Ref<boolean | null> // When loading is a ref in a template
	loadingError?: Ref<string | null> // When loading is a ref in a template
	setLoading?: (value: boolean) => void // When loading is state in a store
	setLoadingError?: (value: string | null) => void // When loading is state in a store
}

export async function apiFetch(apiCall: Promise<any>, { onSuccess, onError, loading, loadingError, setLoading, setLoadingError }: FetchOptions) {
	// let success = false
	if (loading) loading.value = true // For templates
	if (loadingError) loadingError.value = null // For templates
	if (setLoading) setLoading(true) // For pinia
	if (setLoadingError) setLoadingError(null) // For pinia

	try {
		const response = await apiCall
		if (response.status === 200) {
			// success = true
			if (onSuccess) onSuccess(response.data)
		} else {
			if (loadingError) loadingError.value = response.statusText
			if (setLoadingError) setLoadingError(response.statusText)
			if (onError) onError(response)
		}
	} catch (error) {
		const errMsg = 'Something went wrong fetching the molecule data.'
		if (loadingError) loadingError.value = errMsg
		if (setLoadingError) setLoadingError(errMsg)
		if (onError) onError(error)
	} finally {
		if (loading) loading.value = false
		if (setLoading) setLoading(false)
	}
	// return success
}
