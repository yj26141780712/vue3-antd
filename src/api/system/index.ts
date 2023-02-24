import type { RequestOptions, Result } from "@/types/axios";
import { http } from "@/utils/http";
import axios from "axios";
import type { Pagination } from "../comon/model/Pagination";
import type { CompanyModel, CompanySearchForm } from "./model/company";
import type { MenuModel, MenuSearchForm } from "./model/menu";
import type { RoleModel, RoleSearchForm } from "./model/role";

//公司接口

export function getCompanyListApi(params: CompanySearchForm & Pagination,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
    }) {
    return http.get<CompanyModel[]>({ url: 'company/list', params: params }, options);
}

export function createCompany(params: CompanyModel,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'company/create', data: params }, options);
}

export function updateCompanyById(id: number, params: CompanyModel,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'company/updateById', data: params, params: { id } }, options);
}

export function deleteCompanyById(id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.get({ url: 'company/deleteById', params: { id } }, options);
}

export function companyGetMenusById(id: number,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none'
    }) {
    return http.get<CompanyModel[]>({ url: 'company/menus', params: { id } }, options);
}

export function companySetMenus(id: number, menus: string, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post<Result<any>>({
        url: 'company/updateMenusById', params: { id }, data: {
            menus
        }
    }, options);
}


// 菜单接口

export function getMenuListApi(params: MenuSearchForm,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
    }) {
    return http.get<Result<MenuModel>>({ url: 'menu/list', params: params }, options);
}

export function createMenuApi(params: MenuModel,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'menu/create', data: params }, options);
}

export function updateMenuByIdApi(id: number, params: MenuModel,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'menu/updateById', data: params, params: { id } }, options);
}

export function deleteMenuByIdApi(id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.get({ url: 'menu/deleteById', params: { id } }, options);
}

// 角色接口

export function getRoleListApi(params: RoleSearchForm,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'none', isTransformResponse: false
    }) {
    return http.get<RoleModel[]>({
        url: 'role/list',
        params: params
    }, options);
}

export function createRoleApi(params: RoleModel,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'role/create', data: params }, options);
}

export function updateRoleByIdApi(id: number, params: RoleModel,
    options: RequestOptions = {
        errorMessageMode: 'message', successMessageMode: 'message'
    }) {
    return http.post({ url: 'role/updateById', data: params, params: { id } }, options);
}

export function deleteRoleByIdApi(id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.get({ url: 'role/deleteById', params: { id } }, options);
}

export function roleSetMenus(id: number, menus: string, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'message'
}) {
    return http.post<Result<any>>({
        url: 'role/updateMenusById', params: { id }, data: {
            menus
        }
    }, options);
}

export function roleGetMenus(id: number, options: RequestOptions = {
    errorMessageMode: 'message', successMessageMode: 'none'
}) {
    return http.get<any[]>({
        url: 'role/menusById', params: { id }
    }, options);
}

export function getCompanyMenus() {
    return http.get<MenuModel[]>({
        url: 'menu/listByCompany',
    }, { successMessageMode: 'none' });
}