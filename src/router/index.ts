import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '@/layout/LoginLayout.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user',
      name: 'user',
      component: LoginLayout,
      redirect: '/user/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/user/Login.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/user/Register.vue')
        }
      ]
    },
    {
      path: '/recover',
      name: 'recover',
      component: undefined
    },
    {
      path: '/',
      redirect: '/user/login'
    }
  ]
})

export default router
