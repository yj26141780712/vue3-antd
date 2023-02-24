
import { getInfoApi, getUserMenusApi, loginApi } from "@/api/user";
import type { MenuItem } from "@/api/user/model/menuModel";
import type { LoginParams, LoginResultModel } from "@/api/user/model/userModel";
import { CACHE_REFRESH_TOKEN, CACHE_TOKEN } from "@/enums/cacheEnum";
import { LoginType } from "@/enums/loginEnum";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";


export const useUserStore = defineStore('user', () => {
    const token = useLocalStorage(CACHE_TOKEN, '');
    const refreshToken = useLocalStorage(CACHE_REFRESH_TOKEN, '');
    const roles = reactive([]);
    let userInfo = ref<any>({});
    const getRoleLength = computed(() => roles.length);
    let userMenus = ref([]);
    let siderMenus = ref<MenuItem[]>([]);
    const login = async (info: LoginParams, type: LoginType) => {
        if (type === LoginType.AccountLogin) {
            const res = await loginApi(info, 'none');
            setToken(res);
            return await Promise.resolve();
        } else if (type === LoginType.CodeLogin) {

        }
    }
    const setToken = function (res: LoginResultModel) {
        token.value = res.token;
        if (res.refreshToken) {
            refreshToken.value = res.refreshToken;
        }
    }
    const logout = function () {
        userInfo.value = {};
        userMenus.value = [];
        siderMenus.value = [];
        token.value = '';
        refreshToken.value = '';
    }
    const getToken = computed(() => token.value);
    const toMenus = (arr: any[], parentId = 0) => {
        const menus = arr.filter(x => x.parentId === parentId);
        if (menus.every(x => x.sort != null || x.sort != undefined)) {
            menus.sort((a, b) => a.sort - b.sort);
        }
        const newArr: MenuItem[] = menus.map(x => {
            const obj: MenuItem = {
                id: x.id,
                key: x.id,
                icon: x.icon,
                title: x.name,
                url: x.url
            };
            const children = toMenus(arr, x.id);
            if (children.length > 0) {
                obj.children = children;
            }
            return obj;
        })
        return newArr;
    };
    const getUserMenus = async function () {
        try {
            const res = await getUserMenusApi();
            userMenus.value = res;
            const home: MenuItem = { id: 0, key: '0', icon: 'icon-home', url: 'home', title: '主页' }
            siderMenus.value = [home]
                .concat(toMenus(userMenus.value, 0));
        } catch (err) {
            throw err;
        }


    }
    const getUserInfo = async function () {
        try {
            const res = await getInfoApi();
            userInfo.value = res;
        } catch (err) {
            throw err;
        }
    }
    return { token, userInfo, getRoleLength, getToken, siderMenus, login, logout, getUserMenus, getUserInfo };
})