<template>
    <BaseList class="page-container" :columns="columns" :dataSrouce="dataSrouce" :loading="loading" :pagination="pagination"
        @reload="reload" @tableChange="handleTableChange">
        <template #search>
            <a-form ref="searchFormRef" :model="searchFormState">
                <a-row :gutter="[16, 16]">
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item :label="'设备id'" name="name">
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
                <!-- <a @click="openMenuForm(record)">
                    设置权限
                </a> -->
            </template>
        </template>
    </BaseList>
    <DeviceForm v-if="deviceFormOption.show" :option="deviceFormOption" @close="closeDeviceForm"></DeviceForm>
</template>

<script setup lang="ts">
import { getDeviceListApi, deleteDeviceByIdApi } from '@/api/sell';
import { reactive, ref, toRaw, computed } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import type { FormInstance } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import type { Result } from '@/types/axios';
import { tableShowTotal } from '@/utils/table';
import type { RoleModel } from '@/api/system/model/role'; import type { FormOption } from '@/types/form';
import DeviceForm from './components/DeviceForm.vue';

interface FormState {
    name: string;
    desc?: string;
    value?: string;
}

const { createConfirm } = useMessage();

defineOptions({
    name: 'SellDevice',
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
    return getDeviceListApi({
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

const reload = () => {
    refresh({});
}

// 表单处理
const deviceFormOption = ref<FormOption>({
    show: false,
    title: '新增',
    item: null
});

const addItem = () => {
    deviceFormOption.value.item = null;
    deviceFormOption.value.show = true;
    deviceFormOption.value.title = '新增';
    console.log(deviceFormOption.value);
}

const editItem = (record: any) => {
    deviceFormOption.value.item = record;
    deviceFormOption.value.show = true;
    deviceFormOption.value.title = '编辑';
    console.log(deviceFormOption.value);
}

const deleteItem = (record: any) => {
    createConfirm({
        title: '确定要删除？',
        iconType: 'info',
        onOk: () => {
            deleteDeviceByIdApi(record.id).then(() => {
                refresh({});
            })
        }
    })
}

const closeDeviceForm = () => {
    deviceFormOption.value.show = false;
}

</script>
<style lang="less" scoped>
.form-tab {
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>