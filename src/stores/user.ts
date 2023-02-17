
import { getInfoApi, loginApi } from "@/api/user";
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
    const info = reactive({});
    const getRoleLength = computed(() => roles.length);
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
    const getToken = computed(() => token.value);
    return { token, info, getRoleLength, getToken, login };
})