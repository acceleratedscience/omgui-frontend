// Modules
import { createRouter, createWebHistory } from 'vue-router'

// Stores
import { useMainStore } from '@/stores/MainStore'

// Components
import HomeView from '@/pages/HomeView.vue'

const routes = [
	{
		path: '/home',
		name: 'home',
		component: HomeView,
	},
	{
		path: '/',
		redirect: '/~/',
	},
	{
		path: '/~/:path(.*)?',
		name: 'filebrowser',
		component: () => import(`@/pages/ViewerDispatch.vue`),
	},
	// {
	// 	path: '/mol',
	// 	name: 'mol',
	// 	component: () => import('@/pages/MolPage.vue'),
	// },
	{
		path: '/mol/:identifier?',
		name: 'mol',
		props: true,
		component: () => import('@/pages/MolPage.vue'),
	},
	{
		path: '/smol',
		alias: '/mmol',
		name: 'smol-mmol',
		redirect: '/mol',
	},
	{
		path: '/smol/:identifier',
		name: 'smol',
		props: true,
		component: () => import('@/pages/MolPage.vue'),
	},
	{
		path: '/mmol/:identifier',
		name: 'mmol',
		props: true,
		component: () => import('@/pages/MolPage.vue'),
	},
	{
		path: '/molset/:identifiers',
		name: 'molset',
		props: true,
		component: () => import('@/pages/MolsetPage.vue'),
	},
	{
		// This route doesn't serve anything... it's the previous version of /result but keeping
		// it around for now, may be useful to edit the cached working copy molsets directly?
		path: '/cache/:cacheId',
		name: 'cache',
		props: true,
		component: () => import('@/pages/MolsetPage-cache.vue'),
	},
	{
		path: '/mws',
		name: 'mws',
		component: () => import('@/pages/MoleculeWorkingSet.vue'),
	},
	{
		path: '/result',
		name: 'result',
		props: true,
		component: () => import('@/pages/ResultPage.vue'),
	},
	{
		path: '/dataframe/:dfName',
		name: 'dataframe',
		props: true,
		component: () => import('@/pages/DataframePage.vue'),
	},
	{
		path: '/dataviewer',
		name: 'dataviewer',
		component: () => import('@/viewers/DataViewer.vue'),
	},
	{
		path: '/jsonviewer',
		name: 'jsonviewer',
		component: () => import('@/viewers/JsonViewer.vue'),
	},
	{
		path: '/textviewer',
		name: 'textviewer',
		component: () => import('@/viewers/TextViewer.vue'),
	},
	{
		path: '/cli',
		name: 'cli',
		component: () => import('@/pages/CommandLine.vue'),
	},
	{
		path: '/svg/:filename',
		name: 'svg',
		props: true,
		component: () => import('@/components/BaseIcon.vue'),
	},
	{
		path: '/kitchensink',
		name: 'kitchensink',
		component: () => import('@/pages/KitchenSink.vue'),
	},
	{
		path: '/sandbox',
		name: 'sandbox',
		component: () => import('@/pages/Sandbox.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: () => import('@/pages/NotFound.vue'),
	},
]

// Duplicate each route with a '/headless' prefix and a 'headless' meta field
const proxyRegex = /^(.*)\/proxy\/(\d{4})/
const headlessRoutes = routes.map((route) => ({
	...route,
	path: `/headless${route.path}`,
	// path: route.path.match(proxyRegex) ? route.path.replace(proxyRegex, '$1/proxy/$2/headless') : `/headless${route.path}`,
	name: `headless-${route.name}`,
	meta: { headless: true },
}))

// Create router.
const router = createRouter({
	history: createWebHistory((window as any).dynamicBasePath || ''),
	routes: [...routes, ...headlessRoutes],
})

// When in headless mode, redirect to
// the headless version of the next route.
router.beforeEach((to, from, next) => {
	const mainStore = useMainStore()

	// Block routing if requested.
	// We use the mainStore state for this so we can also cover changes to the URL query.
	// This is in particular needed for
	// if (mainStore.blockRouting) {
	// 	console.log('BLOCK')
	// 	next(false)
	// 	return
	// }

	const exitHeadless = from.path.replace(/^\/headless/, '') == to.path
	if (!mainStore.headless && !exitHeadless && (from.meta.headless || to.meta.headless)) {
		mainStore.setHeadless()
	}
	if (!exitHeadless && from.meta.headless && !to.meta.headless) {
		next({ path: `/headless${to.path}` })
	} else {
		next()
	}
})

// This lets us import the router to any pinia store:
// import { router } from '@/router'
export default router
