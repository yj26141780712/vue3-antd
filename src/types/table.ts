// export interface TableColumn {
//     title: string;
//     dataIndex: string;
//     width?: number;
//     sorter: true,

// }

export interface BaseTableColumn {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    checked: boolean;
}
