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
		component: () => import(/* webpackChunkName: 'ViewerDispatch' */ `@/pages/ViewerDispatch.vue`),
	},
	{
		path: '/mol/:identifier?',
		name: 'mol',
		props: true,
		component: () => import(/* webpackChunkName: 'MolPage' */ '@/pages/MolPage.vue'),
	},
	// {
	// 	path: '/mol',
	// 	name: 'mol-input',
	// 	component: () => import(/* webpackChunkName: 'MolInput' */ '@/pages/MolInput.vue'),
	// },
	// {
	// 	path: '/mol/:identifier',
	// 	name: 'mol',
	// 	props: true,
	// 	component: () => import(/* webpackChunkName: 'MolViewer' */ '@/viewers/MolViewer.vue'),
	// },
	{
		path: '/molset/:cacheId',
		name: 'molset',
		props: true,
		component: () => import(/* webpackChunkName: 'MolsetPage' */ '@/pages/MolsetPage.vue'),
	},
	{
		path: '/my-mols',
		name: 'my-mols',
		component: () => import(/* webpackChunkName: 'MyMols' */ '@/pages/MyMols.vue'),
	},
	{
		path: '/dataviewer',
		name: 'dataviewer',
		component: () => import(/* webpackChunkName: 'DataViewer' */ '@/viewers/DataViewer.vue'),
	},
	{
		path: '/jsonviewer',
		name: 'jsonviewer',
		component: () => import(/* webpackChunkName: 'JsonViewer' */ '@/viewers/JsonViewer.vue'),
	},
	{
		path: '/textviewer',
		name: 'textviewer',
		component: () => import(/* webpackChunkName: 'TextViewer' */ '@/viewers/TextViewer.vue'),
	},
	{
		path: '/cli',
		name: 'cli',
		component: () => import(/* webpackChunkName: 'CommandLine' */ '@/pages/CommandLine.vue'),
	},
	{
		path: '/svg/:filename',
		name: 'svg',
		props: true,
		component: () => import(/* webpackChunkName: 'SvgServe' */ '@/components/SvgServe.vue'),
	},
	{
		path: '/kitchen-sink',
		name: 'kitchen-sink',
		component: () => import(/* webpackChunkName: 'KitchenSink' */ '@/pages/KitchenSink.vue'),
	},
	{
		path: '/sandbox',
		name: 'sandbox',
		component: () => import(/* webpackChunkName: 'Sandbox' */ '@/pages/Sandbox.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: () => import(/* webpackChunkName: 'NotFound' */ '@/pages/NotFound.vue'),
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
