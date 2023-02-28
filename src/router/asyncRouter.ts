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
                        path: 'company', name: 'SystemCompany',
                        meta: { title: '公司管理', keepAlive: true },
                        component: () => import('@/views/system/Company.vue')
                    },
                    { path: 'menu', name: 'SystemMenu', meta: { title: '菜单管理', keepAlive: true }, component: () => import('@/views/system/Menu.vue') },
                    { path: 'role', name: 'SystemRole', meta: { title: '角色管理', keepAlive: true }, component: () => import('@/views/system/Role.vue') },
                    { path: 'account', name: 'SystemAccount', meta: { title: '用户管理', keepAlive: true }, component: () => import('@/views/system/User.vue') }
                ]
            },
            //销售管理
            {
                path: 'sell',
                name: 'sell',
                component: PageView,
                children: [
                    {
                        path: 'device', name: 'SellDevice',
                        meta: { title: '设备管理', keepAlive: true },
                        component: () => import('@/views/device/Device.vue')
                    },
                    {
                        path: 'hitchRegister', name: 'SellHitchRegister',
                        meta: { title: '故障登记', keepAlive: true },
                        component: () => import('@/views/device/HitchRegister.vue')
                    },
                    {
                        path: 'hitchDeal', name: 'SellHitchDeal',
                        meta: { title: '故障处理', keepAlive: true },
                        component: () => import('@/views/device/HitchDeal.vue')
                    }
                ]
            },
            //套餐管理
            {
                path: 'pep',
                name: 'pep',
                component: PageView,
                children: [
                    { path: 'content', name: 'PepContent', meta: { title: '套餐内容', keepAlive: true }, component: () => import('@/views/pep/Content.vue') },
                    { path: 'register', name: 'PepRegister', meta: { title: '套餐登记', keepAlive: true }, component: () => import('@/views/pep/Register.vue') },
                ]
            },
            //医生就诊
            {
                path: 'doctor',
                name: 'doctor',
                component: PageView,
                children: [
                    { path: 'visit', name: 'DoctorVisit', meta: { title: '医生就诊', keepAlive: true }, component: () => import('@/views/docker/Visit.vue') },
                ]
            }
        ]
    }
]

