import type { RequestOptions, Result } from "@/types/axios";
import { http } from "@/utils/http";
import type { Pagination } from "../comon/model/Pagination";
import type { PepModel } from "./model/pepModel";

export function getPepListApi(params: PepModel & Pagination, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
}) {
    return http.get<Result<PepModel[]>>({
        url: 'pep/list',
        params: params
    }, options);
}

export function createPepApi(params: any,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'pep/create', data: params }, options);
}

export function updatePepByIdApi(id: number, params: any,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'pep/updateById', data: params, params: { id } }, options);
}

export function deletePepByIdApi(id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.get({ url: 'pep/deleteById', params: { id } }, options);
}

