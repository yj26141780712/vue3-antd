import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '@/layout/LoginLayout.vue'
import useStore from '@/stores'
import { asyncRouter } from './asyncRouter'
import { useMessage } from "@/hooks/web/useMessage";
import { storeToRefs } from 'pinia';
const { createMessage } = useMessage();


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
    {
      path: '/:pathMatch(.*)',
      name: '404',
      component: () => import('@/views/exception/404.vue'),
    },
    ...asyncRouter
  ]
})

const allowList = ['login', 'register'];
const loginPath = '/user/login';
const defaultRoutePath = '/home';
router.beforeEach((to, from, next) => {
  const { user } = useStore();
  const { token } = user;
  if (token) {
    const { userInfo } = storeToRefs(user);
    if (to.path === loginPath) { // 登录界面无需验证权限
      next({ path: defaultRoutePath })
    } else {
      if (userInfo.value && userInfo.value.roleId) { // 需要获取用户信息
        const { staticRouter } = useStore();
        const { addRouter } = staticRouter;
        if (to.meta && to.meta.title) {
          addRouter(to);
        }
        next();
      } else { //首次登录先获取用户信息 
        const { getUserMenus, getUserInfo, logout } = user;
        Promise.all([getUserMenus(), getUserInfo()])
          .then(() => {
            const redirect = decodeURIComponent((from.query.redirect as string) || to.path)
            if (to.path === redirect) {
              next({ ...to, replace: true })
            } else {
              next({ path: redirect })
            }
          })
          .catch(err => {
            createMessage.error('获取用户信息失败！,请重新登录');
            logout();
            next({ path: loginPath, query: { redirect: to.fullPath } })
          });
      }
    }
  } else {
    if (allowList.includes(to.name as string)) {       // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginPath, query: { redirect: to.fullPath } })
    }
  }
});




export default router


