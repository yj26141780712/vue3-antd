<template>
    <BaseList class="page-container" :columns="columns" :dataSrouce="dataSrouce" :loading="loading" :pagination="pagination"
        @reload="reload" @tableChange="handleTableChange">
        <template #search>
            <a-form ref="searchFormRef" :model="searchFormState">
                <a-row :gutter="[16, 16]">
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item :label="'角色名称'" name="name">
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
            <template v-if="column && column.key === 'actions'">
                <a @click="editItem(record)">
                    编辑
                </a>
                <a @click="deleteItem(record)">
                    删除
                </a>
                <a @click="openMenuForm(record)">
                    设置权限
                </a>
            </template>
        </template>
    </BaseList>
    <BaseForm :visible="formVisible" :title="formTitle" :formLoading="formLoading" @cancel="cancel" @ok="ok">
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
            <a-row :gutter="[16, 16]">
                <a-col span="24">
                    <a-form-item has-feedback :label="'角色名称'" v-bind="validateInfos.name">
                        <a-input v-model:value="modelRef.name" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'角色描述'" v-bind="validateInfos.desc">
                        <a-input v-model:value="modelRef.desc" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'角色关键字'" v-bind="validateInfos.value">
                        <a-input v-model:value="modelRef.value" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>

        </a-form>
    </BaseForm>
    <BaseForm :visible="menuFormVisible" :title="'设置权限'" :formLoading="menuFormLoading" @cancel="menuFormCancel"
        @ok="menuFormOk">
        <a-spin :spinning="menuTreeLoading">
            <div class="form-tab">
                <a-tree v-if="menuTreeData.length" v-model:checkedKeys="checkedKeys" :tree-data="menuTreeData" checkable
                    defaultExpandAll>
                    <template #title="{ title, key }">
                        {{ title }}
                    </template>
                </a-tree>
            </div>
        </a-spin>
    </BaseForm>
</template>

<script setup lang="ts">
import { getRoleListApi, getCompanyMenus, createRoleApi, updateRoleByIdApi, deleteRoleByIdApi, roleSetMenus, roleGetMenus } from '@/api/system';
import { reactive, ref, toRaw, computed } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import type { FormInstance } from 'ant-design-vue';
import type { TreeProps } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { Form } from 'ant-design-vue';
import { getObjectValue, toTreeData } from '@/utils/form';
import { usePagination } from 'vue-request';
import type { Result } from '@/types/axios';
import { tableShowTotal } from '@/utils/table';
import type { RoleModel } from '@/api/system/model/role';;

interface FormState {
    name: string;
    desc?: string;
    value?: string;
}

const { createConfirm } = useMessage();

defineOptions({
    name: 'SystemRole',
});


const searchFormRef = ref<FormInstance>();
const searchFormState = reactive<FormState>({
    name: ''
})

let columns = reactive([
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '角色描述', dataIndex: 'desc', key: 'desc' },
    { title: '角色关键字', dataIndex: 'value', key: 'value' },
    { title: '操作', dataIndex: 'actions', key: 'actions' },
]);

const loadData = function (params: any) {
    return getRoleListApi({
        ...searchFormState,
        ...params
    })
}
const total = ref(0);
const { data: dataSrouce, run, loading, current, pageSize } = usePagination(loadData, {
    formatResult: (res: Result<RoleModel>) => {
        total.value = res.total;
        return res.data;
    },
    pagination: {
        currentKey: 'pageNum',
        pageSizeKey: 'pageSize',
    },
});

const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: tableShowTotal
}));

const handleTableChange = (pag: { pageSize: number; current: number }) => {
    run({
        pageSize: pag.pageSize!,
        pageNum: pag?.current
    })
}

const refresh = ({ size, num }: { size?: number, num?: number }) => {
    run({
        pageSize: size || pageSize.value, pageNum: num || current.value
    });
}

const search = () => {
    refresh({ num: 1 });
}

const reset = () => {
    searchFormRef.value.resetFields();
    refresh({ num: 1 });
}

// 表单处理

const useForm = Form.useForm;
const formVisible = ref(false);
const formTitle = ref('');
const modelRef = reactive<RoleModel>({
    name: '',
    desc: '',
    value: '',
});
const ruleRef: Record<string, Rule[]> = reactive({
    name: [{ required: true, message: '请输入角色名称' }],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, ruleRef, {});

const formLoading = ref(false);
let formType = ref('add');
let opId = 0;

const addItem = () => {
    formType.value = 'add';
    resetFields();
    formTitle.value = '新增'
    formVisible.value = !formVisible.value;
}

const editItem = (record: any) => {
    formType.value = 'edit';
    opId = record.id;
    resetFields({ ...getObjectValue(modelRef, record) })
    formTitle.value = '编辑'
    formVisible.value = !formVisible.value;
}

const deleteItem = (record: any) => {
    opId = record.id;
    createConfirm({
        title: '确定要删除？',
        iconType: 'info',
        onOk: () => {
            deleteRoleByIdApi(opId).then(() => {
                refresh({});
            })
        }
    })
}

const reload = () => {
    refresh({});
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

            if (formType.value === 'add') {
                return createRoleApi(toRaw(modelRef));
            } else {
                return updateRoleByIdApi(opId, toRaw(modelRef));
            }
        })
        .then((res) => {
            console.log(checkedKeys.value);
            console.log(res);
            formLoading.value = false;
            formVisible.value = false;
            refresh({});
        })
        .catch(err => {
            console.log('error', err);
            formLoading.value = false;
        });
}

// 权限表单
let menuFormVisible = ref(false);
let menuFormLoading = ref(false);
let menuTreeLoading = ref(false);
let menuTreeData: TreeProps['treeData'] = []
let checkedKeys = ref<number[]>([]);
let menuFormOpId = 0;

const openMenuForm = (record: any) => {
    checkedKeys.value = [];
    menuTreeData = [];
    menuFormOpId = record.id;
    menuFormVisible.value = true;
    menuTreeLoading.value = true;
    Promise.all([getCompanyMenus(), roleGetMenus(menuFormOpId)])
        .then((results) => {
            if (results[0]) {
                menuTreeData = [{
                    key: 0, title: '全部', children:
                        toTreeData((results[0] || []), 0)
                }];
            }
            if (results[1]) {
                console.log(results[1])
                checkedKeys.value = results[1].map(x => x.id);
            }
            menuTreeLoading.value = false;
        })
        .catch(err => {
            console.log(err);
        })
}

const menuFormCancel = () => {
    menuFormVisible.value = false;
}

const menuFormOk = () => {
    if (menuFormLoading.value === true || menuTreeLoading.value === true) {
        return;
    }
    menuFormLoading.value = true;
    roleSetMenus(menuFormOpId, JSON.stringify(checkedKeys.value.map(x => {
        return { id: x }
    })))
        .then((res) => {
            menuFormLoading.value = false;
            menuFormCancel();
        })
        .catch(err => {
            menuFormLoading.value = false;
        });
}

</script>
<style lang="less" scoped>
.form-tab {
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>