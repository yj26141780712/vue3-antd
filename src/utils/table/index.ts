export const tableOtherHeight = 231;

export const tableTabsHeight = 62;

export const tableShowTotal = (total: number, range: number) => `${range[0]}-${range[1]} ，共 ${total} 项`

export const toTreeData = function (arr: any[], parentId = 0) {
    const datas = arr.filter(x => x.parentId === parentId);
    if (datas.every(x => x.sort != null || x.sort != undefined)) {
        datas.sort((a, b) => a.sort - b.sort);
    }
    datas.forEach(x => {
        x.key = x.id;
        const children = toTreeData(arr, x.id);
        if (children.length > 0) {
            x.children = children;
        }
    })
    return datas;
}

