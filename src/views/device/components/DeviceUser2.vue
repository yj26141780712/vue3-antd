<template>
    <BaseForm :visible="formVisible" :title="props.option.title" @cancel="handleCancel" @afterClose="afterClose"
        :showFooter="false">
        <BaseList class="page-container" style="margin: -48px -24px 0;" :columns="columns" :dataSource="dataSource"
            :loading="loading" :pagination="false" :showScroll="true" :showRightTool="false">
            <template #button>
                <a-button type="primary" @click="addItem">新增</a-button>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="record.id === 0">
                    <template v-if="addKeys.includes(column.dataIndex)">
                        <a-input v-model:value="record[column.dataIndex]">
                        </a-input>
                    </template>
                    <template v-if="column && column.key === 'actions'">
                        <a @click="addSave(record)">
                            保存
                        </a>
                        <a @click="addDelete(record)">
                            删除
                        </a>
                    </template>
                </template>
                <template v-else>
                    <template v-if="editKeys.includes(column.dataIndex)">
                        <template v-if="editableData[record.id]">
                            <a-input v-model:value="editableData[record.id][column.dataIndex]">
                            </a-input>
                        </template>
                        <template v-else>
                            {{ record[column.dataIndex] }}
                        </template>
                    </template>
                    <template v-else-if="column && column.key === 'actions'">
                        <template v-if="editableData[record.id]">
                            <a @click="editSave(record.id)">
                                保存
                            </a>
                            <a @click="editCancel(record.id)">
                                取消
                            </a>
                        </template>
                        <template v-else="editableData[record.id]">
                            <a @click="editItem(record.id)">
                                编辑
                            </a>
                            <a @click="deleteItem(record.id)">
                                删除
                            </a>
                        </template>
                    </template>
                </template>
            </template>
        </BaseList>
    </BaseForm>
</template>

<script setup lang="ts">
import { createDeviceAccountApi, deleteDeviceAccountByIdApi, getDeviceAccountListByDeviceIdApi, updateDeviceAccountByIdApi } from '@/api/sell';
import type { DeviceUserModel } from '@/api/sell/model/deviceModel';
import type { Result } from '@/types/axios';
import { onMounted, reactive, ref, type UnwrapRef } from 'vue';
import { usePagination } from 'vue-request';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '@/hooks/web/useMessage';

const { createConfirm } = useMessage();

const props = defineProps({
    option: {
        type: Object,
        default: null
    }
});

const emits = defineEmits(['close']);
const formVisible = ref(false);

const editableData: UnwrapRef<Record<number, any>> = reactive({});

onMounted(() => {
    formVisible.value = true;
});

const handleCancel = () => {
    formVisible.value = false;
}

const afterClose = () => {
    emits('close', '');
}

let columns = reactive([
    { title: '手机号码', dataIndex: 'phone', key: 'phone', width: 140, fixed: 'left' },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '操作', dataIndex: 'actions', key: 'actions', width: 100, fixed: 'right' },
]);

let addKeys = ['name', 'phone'];
let editKeys = ['name', 'phone'];

const loadData = function () {
    return getDeviceAccountListByDeviceIdApi(props.option.item.id);
}

const { data: dataSource, run, loading } = usePagination(loadData, {
    formatResult: (res: Result<DeviceUserModel>) => {
        return res.data;
    }
});

const addItem = () => {
    if (!dataSource.value) {
        dataSource.value = [];
    }
    dataSource.value.unshift({
        id: 0
    });
}

const editItem = (key: number) => {
    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.id)[0]);
}

const deleteItem = (key: number) => {
    createConfirm({
        title: '确定要删除？',
        iconType: 'info',
        onOk: () => {
            deleteDeviceAccountByIdApi(key).then(() => {
                const index = dataSource.value.findIndex(item => key === item.id);
                dataSource.value.splice(index, 1);
            })
        }
    })
}

const addSave = async (record: DeviceUserModel) => {
    try {
        const res = await createDeviceAccountApi({
            ...record,
            deviceId: props.option.item.id,
        })
        Object.assign(record, { id: res.id });
    } catch (err) {

    }
}

const addDelete = (record: DeviceUserModel) => {
    const index = dataSource.value.findIndex(x => x === record);
    dataSource.value.splice(index, 1);
}

const editSave = async (key: number) => {
    try {
        await updateDeviceAccountByIdApi(editableData[key], editableData[key].id);
        Object.assign(dataSource.value.filter(item => key === item.id)[0], editableData[key]);
        delete editableData[key];
    } catch (err) {

    }
}

const editCancel = (key: number) => {
    delete editableData[key];
}

</script>
<style lang="less" scoped>
.page-container {
    height: 492px;
}
</style>