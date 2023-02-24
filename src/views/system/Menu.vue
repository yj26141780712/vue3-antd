<template>
    <BaseList class="page-container" :columns="columns" :dataSrouce="dataSrouce" :loading="loading" :pagination="false"
        :showScroll="true" @reload="reload" :options="{ searchToolHeight: 80 }">
        <template #search>
            <a-form ref="searchFormRef" :model="searchFormState">
                <a-row :gutter="[16, 16]">
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item :label="'菜单名称'" name="name">
                            <a-input v-model:value="searchFormState.name" autocomplete="off"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item>
                            <a-space>
                                <a-button type="primary" @click="search">搜索</a-button>
                                <a-button type="primary" @click="reset">重置</a-button>
                            </a-space>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </template>
        <template #button>
            <a-button type="primary" @click="addItem">新增</a-button>
        </template>
        <template #headerCell="{ column }">
        </template>
        <template #bodyCell="{ column, record }">
            <template v-if="column && column.key === 'mactions'">
                <a @click="editItem(record)">
                    编辑
                </a>
                <a @click="deleteItem(record)">
                    删除
                </a>
            </template>
        </template>
    </BaseList>
    <BaseForm :visible="formVisible" :title="formTitle" :formLoading="formLoading" @cancel="cancel" @ok="ok">
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
            <a-row :gutter="[16, 16]">
                <a-col span="24">
                    <a-form-item has-feedback :label="'菜单名称'" v-bind="validateInfos.name">
                        <a-input v-model:value="modelRef.name" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'菜单层级'" v-bind="validateInfos.level">
                        <a-input-number v-model:value="modelRef.level" :min=1 autocomplete="off"></a-input-number>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'菜单排序'" v-bind="validateInfos.sort">
                        <a-input-number v-model:value="modelRef.sort" :min=1 autocomplete="off"></a-input-number>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'父菜单'" v-bind="validateInfos.parentId">
                        <a-tree-select v-model:value="modelRef.parentId" show-search style="width: 100%"
                            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" allow-clear tree-default-expand-all
                            :tree-data="menuTreeData">
                            <template #title="{ value: val, title }">
                                {{ title }}
                            </template>
                        </a-tree-select>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'菜单图标'" v-bind="validateInfos.icon">
                        <a-input v-model:value="modelRef.icon" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'菜单URL'" v-bind="validateInfos.url">
                        <a-input v-model:value="modelRef.url" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </BaseForm>
</template>

<script setup lang="ts">

import { createMenuApi, deleteMenuByIdApi, updateMenuByIdApi, getMenuListApi } from '@/api/system';
import { reactive, ref, toRaw, computed } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import type { FormInstance, TreeSelectProps } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { Form } from 'ant-design-vue';
import { getObjectValue, toSelectTreeData } from '@/utils/form';
import { usePagination } from 'vue-request';
import type { Result } from '@/types/axios';
import { toTreeData } from '@/utils/table';
import type { MenuModel, MenuSearchForm } from '@/api/system/model/menu';

const { createConfirm } = useMessage();

defineOptions({
    name: 'SystemMenu',
});

const searchFormRef = ref<FormInstance>();
const searchFormState = reactive<MenuSearchForm>({
    name: ''
})

let columns = reactive([
    { title: '菜单名称', dataIndex: 'name', key: 'name', width: 180, fixed: 'left' },
    { title: '菜单层级', dataIndex: 'level', key: 'level', width: 90 },
    { title: '菜单排序', dataIndex: 'sort', key: 'sort', width: 90 },
    { title: '菜单id', dataIndex: 'id', key: 'id', width: 80 },
    { title: '父菜单id', dataIndex: 'parentId', key: 'parentId', width: 90 },
    { title: '菜单图标', dataIndex: 'icon', key: 'icon', width: 100 },
    { title: '系统菜单', dataIndex: 'isAdmin', key: 'isAdmin', width: 90 },
    { title: '菜单URL', dataIndex: 'url', key: 'url', width: 200 },
    // { title: '操作权限', dataIndex: 'actions', key: 'actions', width: 200 },
    // { title: '关键字', dataIndex: 'value', key: 'value', width: 90 },
    // { title: '是否页面', dataIndex: 'isPage', key: 'isPage', width: 90 },
    { title: '操作', dataIndex: 'mactions', key: 'mactions', width: 100, fixed: 'right' }
]);

let menuDatas: MenuModel[] = [];

const loadData = function () {
    return getMenuListApi({ name: '' });
}

const { data: dataSrouce, run, loading } = usePagination(loadData, {
    formatResult: (res: Result<MenuModel>) => {
        menuDatas = res.data as [];
        return toTreeData(res.data as [] || []);
    }
});

const search = () => { // 客户端搜索
    refresh();
}

const reset = () => {
    searchFormRef.value.resetFields();
    refresh();
}

const refresh = () => {
    run({});
}

const useForm = Form.useForm;
const formVisible = ref(false);
const formTitle = ref('');
const modelRef = reactive<MenuModel>({
    name: '',
    level: 1,
    sort: 1,
    parentId: 0,
    icon: '',
    url: ''
});

const menuTreeData = ref<TreeSelectProps['treeData']>([]);

const ruleRef: Record<string, Rule[]> = reactive({
    name: [{ required: true, message: '请输入菜单名称' }],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, ruleRef, {
    // onValidate: (...args) => console.log(...args),
});

const formLoading = ref(false);
let formType = ref('add');
let opId = 0;

const addItem = () => {
    formType.value = 'add';
    resetFields();
    menuTreeData.value = toSelectTreeData(menuDatas);
    formTitle.value = '新增'
    formVisible.value = !formVisible.value;
}

const editItem = (record: any) => {
    formType.value = 'edit';
    opId = record.id;
    resetFields({ ...getObjectValue(modelRef, record) });
    menuTreeData.value = toSelectTreeData(menuDatas, 0, [opId]);
    formTitle.value = '编辑'
    formVisible.value = !formVisible.value;
}

const deleteItem = (record: any) => {
    opId = record.id;
    createConfirm({
        title: '确定要删除？',
        iconType: 'info',
        // content: '请谨慎操作，删除后公司对应信息都将删除！',
        onOk: () => {
            deleteMenuByIdApi(opId).then(() => {
                refresh();
            })
        }
    })
}

const reload = () => {
    refresh();
}

const cancel = () => {
    if (formLoading.value === true) {
        return;
    }
    formVisible.value = false;
}

const ok = () => {
    if (formLoading.value === true) {
        return;
    }
    formLoading.value = true;
    validate()
        .then(() => {
            if (!modelRef.parentId) {
                modelRef.parentId = 0
            }
            if (formType.value === 'add') {
                return createMenuApi(toRaw(modelRef));
            } else {
                return updateMenuByIdApi(opId, toRaw(modelRef));
            }
        })
        .then((res) => {
            formLoading.value = false;
            formVisible.value = false;
            refresh();
        })
        .catch(err => {
            formLoading.value = false;
        });
}

</script>
<style lang="less" scoped></style>