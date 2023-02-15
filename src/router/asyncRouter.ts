import type { RouteRecordRaw } from "vue-router";
import BasicLayout from '@/layout/BasicLayout.vue';
import Home from '@/views/Home.vue';

export const asyncRouter: readonly RouteRecordRaw[] = [
    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        children: [
            //system
            {
                path: 'home',
                name: 'home',
                component: Home
            }
        ]
    }
]

