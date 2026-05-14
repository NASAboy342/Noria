import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'ជ្រើសរើសអគារ', component: () => import('../pages/dasboard.vue') },
  { path: '/rooms', name: 'បន្ទប់ជួល', component: () => import('../pages/rooms.vue') },
  { path: '/roomDetail', name: 'ព័ត៌មានបន្ទប់', component: () => import('../pages/roomDetail.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})