import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '@/layout/LoginLayout.vue'
import useStore from '@/stores'
import { asyncRouter } from './asyncRouter'

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
        },
        {
          path: 'recover',
          name: 'recover',
          component: undefined
        }
      ]
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/exception/404.vue'),
    },
    ...asyncRouter
  ]
})


router.beforeEach((to, from) => {
  const { user } = useStore();
  const { token, getRoleLength } = user;
  const { staticRouter } = useStore();
  const { addRouter } = staticRouter;
  if (to.meta && to.meta.title) {
    addRouter(to);
  }
  if (token) {
    if (to.path.startsWith('/user')) { // 登录界面无需验证权限

    } else {
      if (getRoleLength === 0) { // 需要获取用户信息

      } else {

      }
    }
  }
  return true
});




export default router


