import type { Ref } from 'vue'
// import domLog from '@/utils/dom-log'

import FileSystemApi from '@/api/FileSystemApi'
import MoleculesApi from '@/api/MoleculesApi'
import MainApi from '@/api/MainApi'
import ResultApi from '@/api/ResultApi'
import DataframeApi from '@/api/DataframeApi'

export const fileSystemApi = new FileSystemApi()
export const moleculesApi = new MoleculesApi()
export const mainApi = new MainApi()
export const resultApi = new ResultApi()
export const dataframeApi = new DataframeApi()

type FetchOptions = {
	onSuccess?: ((response: any) => void) | null
	onError?: ((error: any) => void) | null

	loading?: Ref<boolean | null> // When loading is a ref in a template
	loadingError?: Ref<string | null> // When loading is a ref in a template
	status?: Ref<number | null> // When loading is a ref in a template - for API response status number

	setLoading?: (value: boolean) => void // When loading is state in a store
	setLoadingError?: (value: string | null) => void // When loading is state in a store
	setStatus?: (value: number | null) => void // When loading is state in a store - for API response status number
}

export async function apiFetch(
	apiCall: Promise<any>,
	{ onSuccess, onError, loading, loadingError, status, setLoading, setLoadingError, setStatus }: FetchOptions,
) {
	// For templates
	if (loading) loading.value = true
	if (loadingError) loadingError.value = null
	if (status) status.value = null

	// For pinia
	if (setLoading) setLoading(true)
	if (setLoadingError) setLoadingError(null)
	if (setStatus) setStatus(null)

	try {
		const response = await apiCall
		const responseString = JSON.stringify(response, null, 2)
		if (response.status === 200) {
			// success = true
			if (onSuccess) onSuccess(response.data)
		} else {
			if (loadingError) loadingError.value = response.statusText
			if (setLoadingError) setLoadingError(response.statusText)
			if (onError) onError(response)
			const data = response.data && typeof response.data === 'string' ? `\n${response.data}` : ''
			console.log(
				`\n%cAPI Error ${response.status}:%c ${response.statusText}%c${data}\n`,
				'color:#d00;text-transform:uppercase',
				'text-transform:uppercase',
				'font-style:italic',
			)
		}
		if (status) status.value = response.status
		if (setStatus) setStatus(response.status)
	} catch (error) {
		const errMsg = 'Something went wrong fetching the molecule data.'
		if (loadingError) loadingError.value = errMsg
		if (setLoadingError) setLoadingError(errMsg)
		if (onError) onError(error)
		if (status) status.value = 0
		if (setStatus) setStatus(0)
	} finally {
		if (loading) loading.value = false
		if (setLoading) setLoading(false)
	}
	// return success
}
