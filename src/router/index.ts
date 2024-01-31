// import HomeView from '../views/HomeView.vue'
import FileBrowser from '../views/FileBrowser.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: FileBrowser
    },
    {
      path: '/a',
      name: 'module-a',
      component: () => import('../views/ModuleA.vue')
    },
    {
      path: '/b',
      name: 'module-b',
      component: () => import('../views/ModuleB.vue')
    }
  ]
})

export default router
