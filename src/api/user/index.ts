
import type { ErrorMessageMode, RequestOptions } from "@/types/axios";
import { http } from "@/utils/http";
import axios from "axios";
import type { Pagination } from "../comon/model/Pagination";
import type { AccountModel } from "./model/accountModel";
import type { LoginParams, LoginResultModel } from "./model/userModel";

enum Api {
    AccountLogin = '',
    MobileLogin = ''
}

export function loginApi(info: LoginParams, errorMessageMode: ErrorMessageMode = 'message') {
    return http.get<LoginResultModel>({
        url: 'account/loginByPassword', params: {
            account: info.userName,
            password: info.password,
            type: 'back'
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

//账号
export function getAccountListApi(params: AccountModel & Pagination,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
    }) {
    return http.get<AccountModel[]>({ url: 'account/list', params: params }, options);
}

export function createAccountApi(params: AccountModel,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'account/create', data: params }, options);
}

export function updateAccountByIdApi(id: number, params: AccountModel,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'account/updateById', data: params, params: { id } }, options);
}

export function deleteAccountByIdApi(id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.get({ url: 'account/deleteById', params: { id } }, options);
}

export function getRoleSelectOptionsApi() {
    return http.get({ url: 'account/roleOptions' }, {
        errorMessageMode: 'none',
        successMessageMode: 'none'
    });
}

export function getAccountListByRoleIdApi(params: AccountModel & Pagination,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
    }, obj?: any) {
    return http.get<AccountModel[]>({
        url: 'account/listByRoleId',
        params: params,
        cancelToken: new axios.CancelToken(c => {
            if (c && obj) {
                obj.cancel = c;
            }
        })
    }, options);
}

export function getAccountListByAccountTypeApi(params: AccountModel & Pagination,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
    }, obj?: any) {
    return http.get<AccountModel[]>({
        url: 'account/listByAccountType',
        params: params,
        cancelToken: new axios.CancelToken(c => {
            if (c && obj) {
                obj.cancel = c;
            }
        })
    }, options);
}