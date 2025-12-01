import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GeneratorView from '../views/GeneratorView.vue'
import LibraryView from '../views/LibraryView.vue'
import ExportView from '../views/ExportView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/generator',
    name: 'generator',
    component: GeneratorView
  },
  {
    path: '/library',
    name: 'library',
    component: LibraryView
  },
  {
    path: '/export',
    name: 'export',
    component: ExportView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router