import type { Ref } from 'vue'

import FileSystemApi from '@/api/FileSystemApi'
import MoleculesApi from '@/api/MoleculesApi'
import MainApi from '@/api/MainApi'

export const fileSystemApi = new FileSystemApi()
export const moleculesApi = new MoleculesApi()
export const mainApi = new MainApi()

type FetchOptions = {
	onSuccess: ((response: any) => void) | null
	onError?: ((error: any) => void) | null
	loading?: Ref<boolean> | null
	loadingError?: Ref<boolean | string> | null
}

export async function fetch(
	apiCall: Promise<any>,
	{ onSuccess, onError, loading, loadingError }: FetchOptions,
) {
	// let success = false
	if (loading) loading.value = true
	if (loadingError) loadingError.value = false

	try {
		const response = await apiCall
		if (response.status === 200) {
			// success = true
			if (onSuccess) onSuccess(response.data)
		} else {
			if (loadingError) loadingError.value = response.statusText
			if (onError) onError(response)
		}
	} catch (error) {
		if (loadingError) loadingError.value = 'Something went wrong fetching the molecule data.'
		if (onError) onError(error)
	} finally {
		if (loading) loading.value = false
	}
	// return success
}
