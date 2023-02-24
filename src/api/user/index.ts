
import type { ErrorMessageMode } from "@/types/axios";
import { http } from "@/utils/http";
import type { LoginParams, LoginResultModel } from "./model/userModel";

enum Api {
    AccountLogin = '',
    MobileLogin = ''
}

export function loginApi(info: LoginParams, errorMessageMode: ErrorMessageMode = 'message') {
    return http.get<LoginResultModel>({
        url: 'account/loginByPassword', params: {
            account: info.userName,
            password: info.password
        }
    }, { errorMessageMode });
}

export function getInfoApi() {
    return http.get({
        url: 'account/selfDetail'
    }, { errorMessageMode: 'none', successMessageMode: 'none' });
}

export function getUserMenusApi() {
    return http.get({
        url: 'account/menus'
    }, { errorMessageMode: 'none', successMessageMode: 'none' });
}