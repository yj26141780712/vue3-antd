import type { RequestOptions } from "@/types/axios";
import { http } from "@/utils/http";
import type { Pagination } from "../comon/model/Pagination";
import type { CompanyModel, CompanySearchForm } from "./model/company";

export function getCompanyListApi(params: CompanySearchForm & Pagination,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none'
    }) {
    return http.get<CompanyModel[]>({ url: 'company/list', params: params }, options);
}