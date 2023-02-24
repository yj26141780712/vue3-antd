export interface MenuModel {
    id?: number;
    name: string;
    level?: number;
    sort?: number;
    parentId?: number;
    icon?: string;
    isAdmin?: number;
    url?: string;
    actions?: string;
    value?: string;
    isPage?: string;
}

export interface MenuSearchForm {
    name: string;
}