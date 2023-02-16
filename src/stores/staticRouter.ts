import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { RouteLocationNormalized } from "vue-router";

export const useStaticRouterStore = defineStore('staticRouter', () => {
    const activePath = ref('');
    const selectedRouterList = reactive<{ path: string, title: string }[]>([]);
    const addRouter = function (route: RouteLocationNormalized) {
        if (route.meta.allowManyTabs) {
            if (!selectedRouterList.some(x => x.path === route.fullPath)) {
                selectedRouterList.push({ path: route.fullPath, title: route.meta.title as string });
            }
            activePath.value = route.fullPath
        } else {
            if (!selectedRouterList.some(x => x.path === route.path)) {
                selectedRouterList.push({ path: route.fullPath, title: route.meta.title as string });
            }
            activePath.value = route.path
        }
    };

    return { selectedRouterList, activePath, addRouter };
})