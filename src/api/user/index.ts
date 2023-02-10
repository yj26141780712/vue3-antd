
import type { ErrorMessageMode } from "@/types/axios";
import { http } from "@/utils/http";
import type { LoginParams } from "./model/userModel";

enum Api {
    AccountLogin = '',
    MobileLogin = ''
}

export async function loginApi(info: LoginParams, mode: ErrorMessageMode) {
    const [err, data] = await http.get({
        url: 'account/loginByPassword', params: {
            username: info.userName,
            password: info.password
        }
    });
}