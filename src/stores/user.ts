
import { loginApi } from "@/api/user";
import type { LoginParams } from "@/api/user/model/userModel";
import { LoginType } from "@/enums/loginEnum";
import { defineStore } from "pinia";


export const useUserStore = defineStore('user', () => {
    const login = async (info: LoginParams, type: LoginType) => {
        console.log(type === LoginType.AccountLogin)
        if (type === LoginType.AccountLogin) {
            const res = await loginApi(info, 'none');
            return await Promise.resolve();
        } else if (type === LoginType.CodeLogin) {

        }
    }
    return { login };
})