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
		path: '/~/:path(.*)?',
		name: 'filebrowser',
		component: () => import(/* webpackChunkName: 'viewer-dispatch' */ `@/pages/ViewerDispatch.vue`),
	},
	{
		path: '/',
		redirect: '/~/',
	},
	{
		path: '/molviewer',
		name: 'molviewer-input',
		component: () => import(/* webpackChunkName: 'molviewer-input' */ '@/pages/MolViewerInput.vue'),
	},
	{
		path: '/molviewer/:identifier',
		name: 'molviewer',
		props: true,
		component: () => import(/* webpackChunkName: 'molviewer' */ '@/viewers/MolViewer.vue'),
	},
	{
		path: '/molset/:cacheId',
		name: 'molset',
		props: true,
		component: () => import(/* webpackChunkName: 'molset' */ '@/pages/Molset.vue'),
	},
	{
		path: '/my-mols',
		name: 'my-mols',
		component: () => import(/* webpackChunkName: 'molgrid' */ '@/pages/MyMols.vue'),
	},
	{
		path: '/dataviewer',
		name: 'dataviewer',
		component: () => import(/* webpackChunkName: 'dataviewer' */ '@/viewers/DataViewer.vue'),
	},
	{
		path: '/jsonviewer',
		name: 'jsonviewer',
		component: () => import(/* webpackChunkName: 'jsonviewer' */ '@/viewers/JsonViewer.vue'),
	},
	{
		path: '/textviewer',
		name: 'textviewer',
		component: () => import(/* webpackChunkName: 'textviewer' */ '@/viewers/TextViewer.vue'),
	},
	{
		path: '/cli',
		name: 'cli',
		component: () => import(/* webpackChunkName: 'commandline' */ '@/pages/CommandLine.vue'),
	},
	{
		path: '/svg/:filename',
		name: 'svg',
		props: true,
		component: () => import(/* webpackChunkName: 'svg' */ '@/components/SvgServe.vue'),
	},
	{
		path: '/kitchen-sink',
		name: 'kitchen-sink',
		component: () => import(/* webpackChunkName: 'kitchen-sink' */ '@/pages/KitchenSink.vue'),
	},
	{
		path: '/sandbox',
		name: 'sandbox',
		component: () => import(/* webpackChunkName: 'sandbox' */ '@/pages/Sandbox.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: () => import(/* webpackChunkName: 'not-found' */ '@/pages/NotFound.vue'),
	},
]

// Duplicate each route with a '/headless' prefix and a 'headless' meta field
const headlessRoutes = routes.map((route) => ({
	...route,
	path: `/headless${route.path}`,
	name: `headless-${route.name}`,
	meta: { headless: true },
}))

// Create router.
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [...routes, ...headlessRoutes],
})

// When in headless mode, redirect to
// the headless version of the next route.
router.beforeEach((to, from, next) => {
	const mainStore = useMainStore()
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
