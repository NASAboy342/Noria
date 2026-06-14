import { createRouter, createWebHistory } from 'vue-router'
const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
  navigator.userAgent
)

const routes = [
  { path: '/', name: 'ជ្រើសរើសអគារ', component: () => import(isMobile ? '../pages/dashboardMobile.vue' : '../pages/dasboard.vue') },
  { path: '/rooms', name: 'បន្ទប់ជួល', component: () => import(isMobile ? '../pages/roomsMobile.vue' : '../pages/rooms.vue') },
  { path: '/roomDetail', name: 'ព័ត៌មានបន្ទប់', component: () => import(isMobile ? '../pages/roomDetailMobile.vue' : '../pages/roomDetail.vue') },
  { path: '/roomPaymentDetail', name: 'វិក្កយបត្រ', component: () => import('../pages/roomPaymentDetail.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})