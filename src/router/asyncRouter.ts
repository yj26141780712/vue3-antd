import type { RouteRecordRaw } from "vue-router";
import BasicLayout from '@/layout/BasicLayout.vue';
import PageView from '@/layout/PageView.vue';
import Home from '@/views/Home.vue';


export const asyncRouter: readonly RouteRecordRaw[] = [
    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        children: [
            //home
            {
                path: 'home',
                name: 'home',
                component: Home,
                meta: { title: '主页', keepAlive: true }
            },
            //系统管理
            {
                path: 'system',
                name: 'system',
                component: PageView,
                children: [
                    {
                        path: 'company', name: 'company',
                        meta: { title: '公司管理', keepAlive: false },
                        component: () => import('@/views/system/Company.vue')
                    },
                    { path: 'menu', name: 'menu', meta: { title: '菜单管理', keepAlive: true }, component: () => import('@/views/system/Menu.vue') },
                    { path: 'role', name: 'role', meta: { title: '角色管理', keepAlive: true }, component: () => import('@/views/system/Role.vue') },
                    { path: 'account', name: 'account', meta: { title: '用户管理', keepAlive: true }, component: () => import('@/views/system/User.vue') }
                ]
            }
        ]
    }
]

