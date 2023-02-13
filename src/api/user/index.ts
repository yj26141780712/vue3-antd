
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
            username: info.userName,
            password: info.password
        }
    }, { errorMessageMode });
}