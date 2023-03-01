<template>
    <BaseList class="page-container" :columns="columns" :dataSource="dataSource" :loading="loading" :pagination="pagination"
        :expandedRowRender="true" @reload="reload" @tableChange="handleTableChange">
        <template #search>
            <a-form ref="searchFormRef" :model="searchFormState">
                <a-row :gutter="[16, 16]">
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item :label="'设备id'" name="sn">
                            <a-input v-model:value="searchFormState.sn" autocomplete="off"></a-input>
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
                <a @click="showUser1(record)">
                    使用人
                </a>
                <a @click="showUser2(record)">
                    监护人
                </a>
            </template>
        </template>
    </BaseList>
    <DeviceForm v-if="deviceFormOption.show" :option="deviceFormOption" @close="closeDeviceForm"></DeviceForm>
    <DeviceUser1 v-if="deviceUserOption1.show" :option="deviceUserOption1" @close="closeDeviceUser1"></DeviceUser1>
    <DeviceUser2 v-if="deviceUserOption2.show" :option="deviceUserOption2" @close="closeDeviceUser2"></DeviceUser2>
</template>

<script setup lang="ts">
import { getDeviceListApi, deleteDeviceByIdApi } from '@/api/sell';
import { reactive, ref, computed } from 'vue';
import { useMessage } from '@/hooks/web/useMessage';
import type { FormInstance } from 'ant-design-vue';
import { usePagination } from 'vue-request';
import type { Result } from '@/types/axios';
import { tableShowTotal } from '@/utils/table';
import type { RoleModel } from '@/api/system/model/role'; import type { FormOption } from '@/types/form';
import type { DeviceModel } from '@/api/sell/model/deviceModel';
import DeviceForm from './components/DeviceForm.vue';
import DeviceUser1 from './components/DeviceUser1.vue'; //使用人
import DeviceUser2 from './components/DeviceUser2.vue'; //监护人

interface FormState {
    sn: string;
}

const { createConfirm } = useMessage();

defineOptions({
    name: 'DeviceUserRenew',
});


const searchFormRef = ref<FormInstance>();
const searchFormState = reactive<FormState>({
    sn: ''
})

let columns = reactive([
    { title: '设备id', dataIndex: 'sn', key: 'sn' },
    { title: '购买人姓名', dataIndex: 'buyPersonName', key: 'buyPersonName' },
    { title: '购买人手机号', dataIndex: 'buyPersonPhone', key: 'buyPersonPhone' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '操作', dataIndex: 'actions', key: 'actions' },
]);

const loadData = function (params: any) {
    return getDeviceListApi({
        ...searchFormState,
        ...params
    })
}
const total = ref(0);
const { data: dataSource, run, loading, current, pageSize } = usePagination(loadData, {
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

const closeDeviceForm = (value: string) => {
    deviceFormOption.value.show = false;
    if (value === 'reload') {
        refresh({});
    }
}

// 使用人
const showUser1 = (record: DeviceModel) => {
    deviceUserOption1.value.show = true;
    deviceUserOption1.value.item = record;
}

const deviceUserOption1 = ref<FormOption>({
    show: false,
    title: '使用人',
    item: null
});

const closeDeviceUser1 = (value: string) => {
    deviceUserOption1.value.show = false;
}

// 
const showUser2 = (record: DeviceModel) => {
    console.log('showUser2')
    deviceUserOption2.value.show = true;
    deviceUserOption2.value.item = record;
}

const deviceUserOption2 = ref<FormOption>({
    show: false,
    title: '监护人',
    item: null
});

const closeDeviceUser2 = (value: string) => {
    deviceUserOption2.value.show = false;
}

</script>
<style lang="less" scoped>
.form-tab {
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>