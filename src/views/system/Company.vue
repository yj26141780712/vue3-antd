<template>
    <BaseList class="page-container" :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
        @reload="reload" @tableChange="handleTableChange">
        <template #search>
            <a-form ref="searchFormRef" :model="searchFormState">
                <a-row :gutter="[16, 16]">
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item :label="'公司名称'" name="companyName">
                            <a-input v-model:value="searchFormState.companyName" autocomplete="off"></a-input>
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
                    <a-form-item has-feedback :label="'公司名称'" v-bind="validateInfos.companyName">
                        <a-input v-model:value="modelRef.companyName" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'公司地址'"
                        v-bind="modelRef.companyAddress && validateInfos.companyAddress">
                        <a-input v-model:value="modelRef.companyAddress" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'联系方式'" v-bind="modelRef.companyPhone && validateInfos.companyPhone">
                        <a-input v-model:value="modelRef.companyPhone" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'公司邮箱'" v-bind="modelRef.companyEmail && validateInfos.companyEmail">
                        <a-input v-model:value="modelRef.companyEmail" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'管理员账号'" v-bind="validateInfos.adminAccount">
                        <a-input v-model:value="modelRef.adminAccount" autocomplete="off"
                            :disabled="formType === 'edit'"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'管理员手机号'" v-bind="modelRef.adminPhone && validateInfos.adminPhone">
                        <a-input v-model:value="modelRef.adminPhone" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'管理员密码'" v-bind="validateInfos.adminPassword">
                        <a-input v-model:value="modelRef.adminPassword" :type="isShowPassword ? 'text' : 'password'"
                            autocomplete="off">
                            <template #suffix>
                                <icon-font :type="isShowPassword ? 'icon-eye' : 'icon-eye-close'"
                                    @click="isShowPassword = !isShowPassword" />
                            </template>
                        </a-input>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </BaseForm>
    <BaseForm :visible="menuFormVisible" :title="'设置公司权限'" :formLoading="menuFormLoading" @cancel="menuFormCancel"
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
import { getCompanyListApi, createCompany, updateCompanyById, deleteCompanyById, getMenuListApi, companyGetMenusById, companySetMenus } from '@/api/system';
import { reactive, ref, toRaw, computed } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import type { FormInstance, TreeProps } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { Form } from 'ant-design-vue';
import { mailReg, phoneReg, accountReg, passwordReg } from '@/types/reg';
import { getObjectValue, toTreeData } from '@/utils/form';
import { usePagination } from 'vue-request';
import type { Result } from '@/types/axios';
import { tableShowTotal } from '@/utils/table';
import type { CompanyModel } from '@/api/system/model/company';

interface FormState {
    companyName: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    adminAccount?: string;
    adminPhone?: string;
    adminPassword?: string;
}

const { createConfirm } = useMessage();

defineOptions({
    name: 'SystemCompany',
});


const searchFormRef = ref<FormInstance>();
const searchFormState = reactive<FormState>({
    companyName: ''
})

let columns = reactive([{
    title: '公司名称',
    dataIndex: 'companyName',
    key: 'companyName',
},
{
    title: '公司地址',
    dataIndex: 'companyAddress',
    key: 'companyAddress',
},
{
    title: '联系方式',
    dataIndex: 'companyPhone',
    key: 'companyPhone',
},
{
    title: '公司邮箱',
    key: 'companyEmail',
    dataIndex: 'companyEmail',
},
{
    title: '管理员账号',
    key: 'adminAccount',
    dataIndex: 'adminAccount',
},
{
    title: '管理员手机号',
    key: 'adminPhone',
    dataIndex: 'adminPhone'
},
{
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    sorter: true,
    sortOrder: false,
},
{
    title: '操作',
    dataIndex: 'actions',
    key: 'actions',
}]);

const loadData = function (params: any) {
    return getCompanyListApi({
        ...searchFormState,
        ...params
    })
}
const total = ref(0);
const sortField = ref('');
const sortOrder = ref('');
const { data: dataSource, run, loading, current, pageSize } = usePagination(loadData, {
    formatResult: (res: Result<CompanyModel>) => {
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

const handleTableChange = (pag: { pageSize: number; current: number },
    filters: any,
    sorter: any) => {
    sortField.value = sorter.order && sorter.field;
    sortOrder.value = sorter.order && (sorter.order === 'ascend' ? 'Desc' : 'Asc');
    const findColumn = columns.find(x => x.dataIndex === sorter.field);
    if (findColumn) {
        findColumn.sortOrder = sorter.order;
    }
    run({
        pageSize: pag.pageSize!,
        pageNum: pag?.current,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
        ...filters,
    })
}

const refresh = ({ size, num }: { size?: number, num?: number }) => {
    columns.forEach(x => {
        if (x.sorter) {
            x.sortOrder = false;
        }
    });
    sortField.value = '';
    sortOrder.value = '';
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

const useForm = Form.useForm;
const formVisible = ref(false);
const formTitle = ref('');
const modelRef = reactive<FormState>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    adminAccount: '',
    adminPhone: '',
    adminPassword: ''
});


const ruleRef: Record<string, Rule[]> = reactive({
    companyName: [{ required: true, message: '请输入公司名称' }],
    companyEmail: [{ type: 'string', pattern: mailReg, message: '请输入正确的邮箱！' }],
    adminAccount: [
        { required: true, message: '请输入管理员账号' },
        { type: 'string', pattern: accountReg, message: '请输入正确的账号，6-20位的数字和字母混合组成！' }
    ],
    adminPhone: [{ type: 'string', pattern: phoneReg, message: '请输入正确的手机号！' }],
    adminPassword: [
        { required: true, message: '请输入管理员账号密码' },
        { type: 'string', pattern: passwordReg, message: '请输入正确的密码，6-20位的数字或者字母！' }
    ],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, ruleRef, {
    // onValidate: (...args) => console.log(...args),
});


const isShowPassword = ref(false);
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
    resetFields({ ...getObjectValue(modelRef, record) });
    console.log(modelRef)
    formTitle.value = '编辑'
    formVisible.value = !formVisible.value;
}

const deleteItem = (record: any) => {
    opId = record.id;
    createConfirm({
        title: '确定要删除？',
        iconType: 'info',
        content: '请谨慎操作，删除后公司对应信息都将删除！',
        onOk: () => {
            deleteCompanyById(opId).then(() => {
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
                return createCompany(toRaw(modelRef));
            } else {
                return updateCompanyById(opId, toRaw(modelRef));
            }
        })
        .then((res) => {
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
    Promise.all([getMenuListApi({ name: '' }), companyGetMenusById(menuFormOpId)])
        .then((results) => {
            if (results[0]) {
                menuTreeData = [{ key: 0, title: '全部', children: toTreeData((results[0].data as []), 0) }];
            }
            if (results[1]) {
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
    companySetMenus(menuFormOpId,
        JSON.stringify(checkedKeys.value.map(x => {
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