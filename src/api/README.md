API calls should be implementyed as such:

    // API
    import { fetch, generalApi } from '@/api/ApiService'

    // Definitions
    const loading = ref<boolean>(false)
    const loadingError = ref<string | false>(false)

    const filePath: string = route.path.replace(/(^\/headless)?\/~(\/)?/, '')
        fetch(generalApi.fetchFoobar(param1, param2), {
            onSuccess: (response) => {
                //
            },
            onError: (error) => {
                //
            },
            loading,
            loadingError,
        })