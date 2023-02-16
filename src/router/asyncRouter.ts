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
                        path: 'company', name: 'systemCompany',
                        meta: { title: '公司管理', keepAlive: false },
                        component: () => import('@/views/system/Company.vue')
                    },
                    { path: 'menu', name: 'systemMenu', meta: { title: '菜单管理', keepAlive: true }, component: () => import('@/views/system/Menu.vue') },
                    { path: 'role', name: 'systemRole', meta: { title: '角色管理', keepAlive: true }, component: () => import('@/views/system/Role.vue') },
                    { path: 'user', name: 'systemUser', meta: { title: '用户管理', keepAlive: true }, component: () => import('@/views/system/User.vue') }
                ]
            }
        ]
    }
]

