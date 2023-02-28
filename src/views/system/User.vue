<template>
    <div class="page-container">
        <a-row :gutter="[16, 16]">
            <a-col :xs="24" :md="8" :lg="6">
                <a-tabs v-model:activeKey="activeKey" :centered="true" @change="tabChange">
                    <a-tab-pane key="system" tab="系统账户">
                    </a-tab-pane>
                    <a-tab-pane key="normal" tab="客户账户">
                    </a-tab-pane>
                </a-tabs>
                <div style="padding: 12px 18px">
                    <!-- <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search" /> -->
                    <a-tree v-if="treeData.length" v-model:selectedKeys="selectedKeys" :tree-data="treeData" block-node
                        defaultExpandAll @select="selectTreeNode">
                        <template #title="{ title }">
                            <div style="width: 100%;">
                                <icon-font type="icon-user" style="margin-right: 8px;"></icon-font>
                                <span>{{ title }}</span>
                            </div>
                        </template>
                    </a-tree>
                </div>
            </a-col>
            <a-col :xs="24" :md="16" :lg="18">
                <BaseList :columns="columns" :dataSrouce="dataSrouce" :loading="loading" :pagination="pagination"
                    :showScroll="true" :options="{ searchToolHeight: 80 }" @reload="reload"
                    @tableChange="handleTableChange">
                    <template #search>
                        <a-form ref="searchFormRef" :model="searchFormState">
                            <a-row :gutter="[16, 16]">
                                <a-col :xs="24" :sm="24" :md="12" :lg="8">
                                    <a-form-item :label="'账号'" name="account">
                                        <a-input v-model:value="searchFormState.account" autocomplete="off"></a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :xs="24" :sm="24" :md="12" :lg="8">
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
                        <a-button v-if="activeKey === 'system'" type="primary" @click="addItem">新增</a-button>
                    </template>
                    <template #headerCell="{ column }">
                    </template>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column && column.key === 'sex'">
                            {{ record.sex === 1 ? '男' : '女' }}
                        </template>
                        <template v-if="column && column.key === 'actions'">
                            <a v-if="activeKey === 'system'" @click="editItem(record)">
                                编辑
                            </a>
                            <a v-if="activeKey === 'system'" @click="deleteItem(record)">
                                删除
                            </a>
                        </template>
                    </template>
                </BaseList>
                <BaseForm :visible="formVisible" :title="formTitle" :formLoading="formLoading" @cancel="cancel" @ok="ok">
                    <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                        <a-row :gutter="[16, 16]">
                            <a-col :xs='24'>
                                <a-form-item has-feedback :label="'账号'" v-bind="validateInfos.account">
                                    <a-input v-model:value="modelRef.account" autocomplete="off"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :xs='24'>
                                <a-form-item has-feedback :label="'密码'" v-bind="validateInfos.password">
                                    <a-input v-model:value="modelRef.password" autocomplete="off"
                                        :type="isShowPassword ? 'text' : 'password'">
                                        <template #suffix>
                                            <icon-font :type="isShowPassword ? 'icon-eye' : 'icon-eye-close'"
                                                @click="isShowPassword = !isShowPassword" />
                                        </template>
                                    </a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :xs='24'>
                                <a-form-item has-feedback :label="'手机号'" v-bind="validateInfos.phone">
                                    <a-input v-model:value="modelRef.phone" autocomplete="off"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :xs='24'>
                                <a-form-item has-feedback :label="'姓名'" v-bind="validateInfos.name">
                                    <a-input v-model:value="modelRef.name" autocomplete="off"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :xs='24'>
                                <a-form-item has-feedback :label="'性别'" v-bind="validateInfos.sex">
                                    <a-radio-group v-model:value="modelRef.sex" name="radioGroup">
                                        <a-radio :value="1">男</a-radio>
                                        <a-radio :value="2">女</a-radio>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                            <a-col :xs='24'>
                                <a-form-item has-feedback :label="'出生年月'" v-bind="validateInfos.birthday">
                                    <a-date-picker v-model:value="modelRef.birthday" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs='24'>
                                <a-form-item has-feedback :label="'角色'" v-bind="validateInfos.roleId">
                                    <a-select ref="select" v-model:value="modelRef.roleId">
                                        <a-select-option :value="0">无</a-select-option>
                                        <a-select-option v-for="(item, index) in formRoles" :value="item.id">
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </BaseForm>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { getRoleListApi } from '@/api/system';
import { getAccountListByRoleIdApi, getAccountListByAccountTypeApi, createAccountApi, updateAccountByIdApi, deleteAccountByIdApi, getRoleSelectOptionsApi } from '@/api/user';
import { reactive, ref, toRaw, computed, onMounted } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import type { FormInstance, TreeProps } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { Form } from 'ant-design-vue';
import { getObjectValue } from '@/utils/form';
import { usePagination } from 'vue-request';
import type { Result } from '@/types/axios';
import { tableShowTotal } from '@/utils/table';
import type { RoleModel } from '@/api/system/model/role';
import type { AccountModel } from '@/api/user/model/accountModel';
import { accountReg, passwordReg, phoneReg } from '@/types/reg';
import dayjs from 'dayjs';

const { createConfirm } = useMessage();


defineOptions({
    name: 'SystemAccount',
});

onMounted(() => {
    getTreeData();
});

// tabs
const activeKey = ref<'system' | 'normal'>('system');
const treeData = ref<TreeProps['treeData']>([]);
const selectedKeys = ref<number[]>([-1]);

const tabChange = () => {
    treeData.value = [];
    selectedKeys.value = [-1];
    getTreeData();
    refresh({});
}

const getTreeData = () => {
    if (activeKey.value === 'system') {
        getRoleListApi({ name: '' }, { successMessageMode: 'none' })
            .then(res => {
                if (activeKey.value === 'system') {
                    treeData.value = [
                        {
                            title: '全部',
                            key: -1,
                            children: res.map(x => {
                                return { title: x.name, key: x.id }
                            })
                        }
                    ];
                }
            });
    } else {
        treeData.value = [
            {
                title: '全部',
                key: -1,
                children: [
                    { title: '监护人', key: 2 },
                    { title: '使用人', key: 1 }
                ]
            }
        ];
    }
}

// search
const searchFormRef = ref<FormInstance>();
const searchFormState = reactive<AccountModel>({
    account: ''
})

let columns = reactive([
    { title: '账号', dataIndex: 'account', key: 'account', width: 120, fixed: 'left' },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    { title: '性别', dataIndex: 'sex', key: 'sex', width: 120 },
    { title: '出生年月', dataIndex: 'birthday', key: 'birthday', width: 120 },
    { title: '角色', dataIndex: 'roleName', key: 'roleName', width: 120 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    { title: '操作', dataIndex: 'actions', key: 'actions', width: 120, fixed: 'right' },
]);

const loadData = function (params: any) {
    if (activeKey.value === 'system') {
        return getAccountListByRoleIdApi({
            ...searchFormState,
            roleId: selectedKeys.value[0] >= 0 ? selectedKeys.value[0] : null,
            ...params
        });
    } else {
        return getAccountListByAccountTypeApi({
            ...searchFormState,
            accountType: selectedKeys.value[0] >= 0 ? selectedKeys.value[0] : null,
            ...params
        });
    }
}
const total = ref(0);
const sortField = ref('');
const sortOrder = ref('');
const { data: dataSrouce, run, loading, current, pageSize } = usePagination(loadData, {
    formatResult: (res: Result<any>) => {
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

const selectTreeNode = () => {
    console.log(selectedKeys)
    refresh({});
}

const handleTableChange = (pag: { pageSize: number; current: number },
    filters: any,
    sorter: any) => {
    sortField.value = sorter.order && sorter.field;
    sortOrder.value = sorter.order && (sorter.order === 'ascend' ? 'Desc' : 'Asc');
    // const findColumn = columns.find(x => x.dataIndex === sorter.field);
    // if (findColumn) {
    //     findColumn.sortOrder = sorter.order;
    // }
    run({
        pageSize: pag.pageSize!,
        pageNum: pag?.current,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
        ...filters,
    })
}

const refresh = ({ size, num }: { size?: number, num?: number }) => {
    run({
        pageSize: size || pageSize.value, pageNum: num || current.value
        , sortField: sortField.value, sortOrder: sortOrder.value
    });
}

const search = () => {
    refresh({ num: 1 });
}

const reset = () => {
    searchFormRef.value.resetFields();
    refresh({ num: 1 });
}

const reload = () => {
    refresh({});
}

// form
const isShowPassword = ref(false);
const useForm = Form.useForm;
const formVisible = ref(false);
const formTitle = ref('');
const modelRef = reactive<AccountModel>({
    account: '',
    password: '',
    phone: '',
    name: '',
    sex: 1,
    birthday: null,
    roleId: 0
});
const formRoles = ref<RoleModel[]>([]);

const ruleRef: Record<string, Rule[]> = reactive({
    account: [{ required: true, message: '请输入公司名称' },
    { type: 'string', pattern: accountReg, message: '请输入正确的账号，6-20位的数字和字母混合组成！' }],
    password: [{ required: true, message: '请输入密码' },
    { type: 'string', pattern: passwordReg, message: '请输入正确的密码，6-20位的数字或者字母！' }],
    phone: [{ type: 'string', pattern: phoneReg, message: '请输入正确的手机号' }],
    roleId: [{ required: true, message: '请选择角色' }]
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
    formTitle.value = '新增'
    formVisible.value = !formVisible.value;
    getRoles();
}

const editItem = (record: any) => {
    formType.value = 'edit';
    opId = record.id;
    resetFields({
        ...getObjectValue(modelRef, {
            ...record,
            birthday: record.birthday ? dayjs(record.birthday) : null
        })
    });
    console.log(modelRef)
    formTitle.value = '编辑'
    formVisible.value = !formVisible.value;
    getRoles();
}

const deleteItem = (record: any) => {
    opId = record.id;
    createConfirm({
        title: '确定要删除？',
        iconType: 'info',
        onOk: () => {
            deleteAccountByIdApi(opId).then(() => {
                refresh({});
            })
        }
    })
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
            const obj = { ...toRaw(modelRef) }
            if (typeof obj.birthday != 'string') {
                obj.birthday = obj.birthday ? (obj.birthday as any).format('YYYY-MM-DD') : '';
            }
            if (formType.value === 'add') {
                return createAccountApi(toRaw(obj));
            } else {
                return updateAccountByIdApi(opId, toRaw(obj));
            }
        })
        .then((res) => {
            formLoading.value = false;
            formVisible.value = false;
            refresh({});
        })
        .catch(err => {
            console.log('error', err);
            formLoading.value = false;
        });
}

const getRoles = () => {
    getRoleSelectOptionsApi().then(res => {
        formRoles.value = res;
    })
}

</script>
<style lang="less" scoped></style>