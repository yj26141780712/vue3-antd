export interface MenuItem {
    id: number;
    key: string;
    icon?: string;
    url?: string;
    parentId?: number;
    title: string;
    children?: MenuItem[]
}