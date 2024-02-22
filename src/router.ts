// Modules
import { createRouter, createWebHistory } from 'vue-router'

// Stores
import { useMainStore } from '@/stores/MainStore'
// import { usePopStateStore } from '@/stores/PopStateStore' // trash

// Components
import HomeView from '@/views/HomeView.vue'

const routes = [
	{
		path: '/home',
		name: 'home',
		component: HomeView,
	},
	{
		path: '/~/:path(.*)?',
		name: 'filebrowser',
		component: () =>
			import(/* webpackChunkName: 'module-dispatch' */ `@/views/ModuleDispatch.vue`),
	},
	{
		path: '/',
		redirect: '/~/',
	},
	{
		path: '/molviewer',
		name: 'molviewer',
		component: () => import(/* webpackChunkName: 'molviewer' */ '@/modules/MolViewer.vue'),
	},
	{
		path: '/molgrid',
		name: 'molgrid',
		component: () => import(/* webpackChunkName: 'molgrid' */ '@/modules/MolGrid.vue'),
	},
	{
		path: '/dataviewer',
		name: 'dataviewer',
		component: () => import(/* webpackChunkName: 'dataviewer' */ '@/modules/DataViewer.vue'),
	},
	{
		path: '/jsonviewer',
		name: 'jsonviewer',
		component: () => import(/* webpackChunkName: 'jsonviewer' */ '@/modules/JsonViewer.vue'),
	},
	{
		path: '/textviewer',
		name: 'textviewer',
		component: () => import(/* webpackChunkName: 'textviewer' */ '@/modules/TextViewer.vue'),
	},
	{
		path: '/commandline',
		name: 'commandline',
		component: () => import(/* webpackChunkName: 'commandline' */ '@/modules/CommandLine.vue'),
	},
	{
		path: '/module-a',
		name: 'module-a',
		component: () => import(/* webpackChunkName: 'module-a' */ '@/modules/ModuleA.vue'),
	},
	{
		path: '/module-b',
		// path: '/:path(headless)?/module-b',
		name: 'module-b',
		component: () => import(/* webpackChunkName: 'module-b' */ '@/modules/ModuleB.vue'),
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
		component: () => import(/* webpackChunkName: 'kitchen-sink' */ '@/views/KitchenSink.vue'),
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
		next({ path: `/headless${to.path}` }) // , replace: true // trash
	} else {
		next()
	}
})

// trash
// router.afterEach((to) => {
// 	console.log('after', to.path)
// 	// console.log('@@', to.path)
// 	const popStateStore = usePopStateStore()
// 	if (popStateStore.popstate) {
// 		console.log('after: pop state!', to.path)
// 		popStateStore.execute()
// 		popStateStore.unsetPopState()
// 	}
// })

export default router
