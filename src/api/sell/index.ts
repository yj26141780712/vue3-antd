import type { RequestOptions } from "@/types/axios";
import { http } from "@/utils/http";
import type { Pagination } from "../comon/model/Pagination";
import type { DeviceModel } from "./model/deviceModel";

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

export function createDeviceApi(params: DeviceModel & Pagination, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({
        url: '/device/create',
        params
    }, options)
}

export function updateDeviceByIdApi(params: DeviceModel & Pagination, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post({
        url: '/device/updateById',
        params
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