import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { RouteLocationNormalized } from "vue-router";

export const useStaticRouterStore = defineStore('staticRouter', () => {
    const refreshing = ref(false);
    const keepNames = reactive([]);
    const activePath = ref('');
    const selectedRouterList = reactive<RouteLocationNormalized[]>([]);
    const addRouter = function (route: RouteLocationNormalized) {
        if (!selectedRouterList.some(x => x.path === route.path)) {
            selectedRouterList.push(route);
            keepNames.push(route.name);
        }
        activePath.value = route.path
    };

    return { refreshing, keepNames, selectedRouterList, activePath, addRouter };
})