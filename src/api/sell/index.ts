import type { RequestOptions } from "@/types/axios";
import { http } from "@/utils/http";
import type { Pagination } from "../comon/model/Pagination";
import type { DeviceAccountModel, DeviceModel, DeviceUserModel, UserRenewModel } from "./model/deviceModel";

//设备管理
export function getDeviceListApi(params: DeviceModel & Pagination,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
    }) {
    return http.get<DeviceModel[]>({
        url: '/device/list',
        params
    }, options)
}

export function createDeviceApi(params: DeviceModel, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({
        url: '/device/create',
        data: params
    }, options)
}

export function updateDeviceByIdApi(id: number, params: DeviceModel & Pagination, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({
        url: '/device/updateById',
        params: { id },
        data: params
    }, options)
}

export function deleteDeviceByIdApi(id: string, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.get({
        url: '/device/deleteById',
        params: { id }
    }, options);
}

//设备使用人
export function getDeviceUserListByDeviceId(deviceId: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
}) {
    return http.get<DeviceUserModel[]>({
        url: '/device/userList',
        params: { deviceId }
    }, options);
}

export function createDeviceUserApi(params: DeviceUserModel, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({
        url: '/device/createUser',
        data: params
    }, options)
}

export function updateDeviceUserByIdApi(params: DeviceUserModel, id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({
        url: '/device/updateUserById',
        data: params,
        params: { id }
    }, options)
}

export function deleteDeviceUserByIdApi(id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.get({
        url: '/device/deleteUserById',
        params: { id }
    }, options)
}

//设备监护人
export function createDeviceAccountApi(params: DeviceAccountModel, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({
        url: '/device/createAccount',
        data: params
    }, options)
}

export function updateDeviceAccountByIdApi(params: DeviceAccountModel, id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({
        url: '/device/updateAccountById',
        data: params,
        params: { id }
    }, options)
}

export function deleteDeviceAccountByIdApi(id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.get({ url: '/device/deleteAccountById', params: { id } })
}

export function getDeviceAccountListByDeviceIdApi(deviceId: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
}) {
    return http.get<DeviceUserModel[]>({
        url: '/device/accountList',
        params: { deviceId }
    }, options);
}

export function deviceUserRenew(params: UserRenewModel, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({ url: '/device/userRenew', data: params }, options)
}