import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/webcam',
    name: 'Webcam',
    component: () => import('@/pages/WebcamPage.vue')
  },
  {
    path: '/image',
    name: 'Image',
    component: () => import('@/pages/ImagePage.vue')
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('@/pages/VideoPage.vue')
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('@/pages/StatsPage.vue')
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('@/pages/GuidePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
