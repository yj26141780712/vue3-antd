export interface BaseTableColumn {
    title: string;
    dataIndex: string;
    key: string | number;
    width?: number;
    checked: boolean;
}

export interface BaseTableTreeDataItem {
    id: number;
    parentId: number;
    key?: number;
    children?: any[];
    [key: string]: any
}


