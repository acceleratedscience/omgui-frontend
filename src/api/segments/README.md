API calls should be implementyed as such:

    // API
    import { apiFetch, generalApi } from '@/api'

    // Definitions
    const loading = ref<boolean>(false)
    const loadingError = ref<string | null>(null)
    const status = ref<number | null>(null)

    const filePath: string = route.path.replace(/(^\/headless)?\/~(\/)?/, '')

    apiFetch(generalApi.fetchFoobar(param1, param2), {
        onSuccess: (response) => {
            //
        },
        onError: (error) => {
            //
        },
        loading,
        loadingError,
        status,

        // When called from within Pinia, we use
        // callback functions instead of references.
        setLoading: this.setLoading,
        setLoadingError: this.setLoadingError,
        setStatus: this.setStatus,
    })
