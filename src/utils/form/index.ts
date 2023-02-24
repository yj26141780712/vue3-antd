import type { DataNode } from "ant-design-vue/lib/tree";

export const getObjectValue = function (o: any, n: any) {
    for (const key in o) {
        if (Object.prototype.hasOwnProperty.call(o, key)) {
            o[key] = n[key];
        }
    }
    return o;
}

export const toSelectTreeData = function (arr: any[], parentId = 0, disabledIds?: []) {
    const datas = arr.filter(x => x.parentId === parentId);
    if (datas.every(x => x.sort != null || x.sort != undefined)) {
        datas.sort((a, b) => a.sort - b.sort);
    }
    const newArr = datas.map(x => {
        const obj: any = {};
        obj.title = x.name;
        obj.value = x.id;
        if (disabledIds && disabledIds.some(id => id === x.id)) {
            obj.disabled = true;
        }
        const children = toSelectTreeData(arr, x.id, disabledIds);
        if (children.length > 0) {
            obj.children = children;
        }
        return obj
    })
    return newArr;
}


export const toTreeData = function (arr: any[], parentId = 0) {
    const datas = arr.filter(x => x.parentId === parentId);
    if (datas.every(x => x.sort != null || x.sort != undefined)) {
        datas.sort((a, b) => a.sort - b.sort);
    }
    const newArr = datas.map(x => {
        const obj: DataNode = {
            key: x.id,
            title: x.name
        }
        const children = toTreeData(arr, x.id);
        if (children.length > 0) {
            obj.children = children;
        }
        return obj;
    })
    return newArr;
}
