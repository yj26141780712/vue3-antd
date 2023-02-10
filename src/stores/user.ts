
import type { LoginParams } from "@/api/user/model/userModel";
import { LoginType } from "@/enums/loginEnum";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user', () => {
    const login = async (info: LoginParams, type: LoginType) => {
        console.log(type === LoginType.AccountLogin)
        if (type === LoginType.AccountLogin) {

            return err;
        } else if (type === LoginType.CodeLogin) {

        }
    }
    return { login };
})