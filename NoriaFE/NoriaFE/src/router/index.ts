import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../pages/dasboard.vue'
import DashboardMobile from '../pages/dashboardMobile.vue'

import Rooms from '../pages/rooms.vue'
import RoomsMobile from '../pages/roomsMobile.vue'

import RoomDetail from '../pages/roomDetail.vue'
import RoomDetailMobile from '../pages/roomDetailMobile.vue'

import RoomPaymentDetail from '../pages/roomPaymentDetail.vue'

const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
  navigator.userAgent
)

const routes = [
  {
    path: '/',
    name: 'ជ្រើសរើសអគារ',
    component: isMobile ? DashboardMobile : Dashboard
  },
  {
    path: '/rooms',
    name: 'បន្ទប់ជួល',
    component: isMobile ? RoomsMobile : Rooms
  },
  {
    path: '/roomDetail',
    name: 'ព័ត៌មានបន្ទប់',
    component: isMobile ? RoomDetailMobile : RoomDetail
  },
  {
    path: '/roomPaymentDetail',
    name: 'វិក្កយបត្រ',
    component: RoomPaymentDetail
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})