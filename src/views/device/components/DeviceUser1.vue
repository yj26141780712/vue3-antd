<template>
    <BaseForm :visible="formVisible" :title="props.option.title" :width="1000" @cancel="handleCancel"
        @afterClose="afterClose" :showFooter="false">
        <BaseList class="page-container" style="margin: -48px -24px 0;" :columns="columns" :dataSource="dataSource"
            :loading="loading" :pagination="false" :showScroll="true" :showRightTool="false">
            <template #button>
                <a-button type="primary" @click="addItem">新增</a-button>
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="record.id === 0">
                    <template v-if="addKeys.includes(column.dataIndex)">
                        <a-select v-if="column.dataIndex === 'sex'" v-model:value="record[column.dataIndex]">
                            <a-select-option v-for="(item, index) in selectOptions[column.dataIndex]" :value="item.value"
                                :key="index">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                        <a-date-picker v-else-if="column.dataIndex === 'serviceEndDate' || column.dataIndex === 'birthday'"
                            v-model:value="record[column.dataIndex]" :placeholder="''" style="width: 115px;" />
                        <a-input-number v-else-if="column.dataIndex === 'height' || column.dataIndex === 'weight'"
                            v-model:value="record[column.dataIndex]" style="width: 80px;" :min="0">
                        </a-input-number>
                        <template v-else-if="column.dataIndex === 'pep'">
                            <a-select v-model:value="record.pepId" style="width: 100px;">
                                <a-select-option v-for="(item, index) in selectOptions[column.dataIndex]"
                                    :value="item.value" :key="index">
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                            <a-date-picker style="margin-left: 8px;width: 115px;" v-model:value="record.purEndDate"
                                :placeholder="''" />
                        </template>
                        <a-input v-else v-model:value="record[column.dataIndex]">
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
                            <a-select v-if="column.dataIndex === 'sex'"
                                v-model:value="editableData[record.id][column.dataIndex]">
                                <a-select-option v-for="(item, index) in selectOptions[column.dataIndex]"
                                    :value="item.value" :key="index">
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                            <a-date-picker
                                v-else-if="column.dataIndex === 'serviceEndDate' || column.dataIndex === 'birthday'"
                                v-model:value="editableData[record.id][column.dataIndex]" :placeholder="''"
                                style="width: 115px;" />
                            <a-input-number v-else-if="column.dataIndex === 'height' || column.dataIndex === 'weight'"
                                v-model:value="editableData[record.id][column.dataIndex]" style="width: 80px;" :min="0">
                            </a-input-number>
                            <template v-else-if="column.dataIndex === 'pep'">
                                <a-select v-model:value="editableData[record.id]['pepId']" style="width: 100px;">
                                    <a-select-option v-for="(item, index) in selectOptions[column.dataIndex]"
                                        :value="item.value" :key="index">
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                                <a-date-picker style="margin-left: 8px;width: 115px;"
                                    v-model:value="editableData[record.id]['purEndDate']" :placeholder="''" />
                            </template>
                            <a-input v-else v-model:value="editableData[record.id][column.dataIndex]">
                            </a-input>
                        </template>
                        <template v-else>
                            <template v-if="column.key === 'sex'">
                                {{ record.sex && (record.sex == 1 ? '男' : '女') }}
                            </template>
                            <template v-else-if="column.key === 'serviceEndDate'">
                                <span>
                                    {{ record[column.dataIndex] }}
                                </span>
                                <a-popover v-if="record[column.dataIndex]"
                                    :visible="renewData[record.id] && renewData[record.id].visible" title="续费截止日期"
                                    trigger="click" @visibleChange="$event => visibleChange($event, record.id)"
                                    :destroyTooltipOnHide="true">
                                    <template #content>
                                        <div>
                                            <a-date-picker @change="$event => dateChange($event, record.id)"
                                                :placeholder="'续费截止日期'" style="width: 115px;" />
                                            <a-button size="small" style="margin-left: 8px;"
                                                @click="renewOk(record.id)">确定</a-button>
                                        </div>
                                    </template>
                                    <a style="margin-left: 8px;" @click="renew(record.id)">续费</a>
                                </a-popover>
                            </template>
                            <template v-else-if="column.key === 'pep'">
                                {{ getPepName(record.pepId) }} {{ record.purEndDate ? `(${record.purEndDate})` : ''
                                }}
                            </template>
                            <template v-else>
                                {{ record[column.dataIndex] }}
                            </template>
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
import { getPepListApi } from '@/api/pep';
import { createDeviceUserApi, deleteDeviceUserByIdApi, deviceUserRenew, getDeviceUserListByDeviceId, updateDeviceUserByIdApi } from '@/api/sell';
import type { DeviceUserModel } from '@/api/sell/model/deviceModel';
import type { Result } from '@/types/axios';
import { onMounted, reactive, ref, type UnwrapRef } from 'vue';
import { usePagination } from 'vue-request';
import { cloneDeep } from 'lodash-es';
import dayjs from 'dayjs';
import { useMessage } from '@/hooks/web/useMessage';
import DeviceUserRenewForm from './DeviceUserRenewForm.vue';
import type { FormOption } from '@/types/form';

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
const pepObj = ref({});
onMounted(() => {
    formVisible.value = true;
    getPepListApi({ name: '' }).then(res => {
        selectOptions['pep'] = res.data.map(x => {
            pepObj.value[x.id] = x.name;
            return { value: x.id, label: x.name };
        })
    });
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
    { title: '服务期限', dataIndex: 'serviceEndDate', key: 'serviceEndDate', width: 140 },
    { title: '首次套餐', dataIndex: 'pep', key: 'pep', width: 280 },
    { title: '出生年月', dataIndex: 'birthday', key: 'birthday', width: 140 },
    { title: '性别', dataIndex: 'sex', key: 'sex', width: 100 },
    { title: '身高', dataIndex: 'height', key: 'height', width: 100 },
    { title: '体重', dataIndex: 'weight', key: 'weight', width: 100 },
    { title: '操作', dataIndex: 'actions', key: 'actions', width: 130, fixed: 'right' },
]);

let addKeys = ['name', 'phone', 'birthday', 'sex', 'height', , 'weight', 'serviceEndDate', 'pep'];
let selectOptions = {
    'userType': [{ value: 1, label: '使用人' }, { value: 2, label: '监护人' }],
    'sex': [{ value: 1, label: '男' }, { value: 2, label: '女' }]
};
let editKeys = ['name', 'phone', 'birthday', 'sex', 'height', , 'weight', 'serviceEndDate', 'pep'];


const getPepName = (id: number) => {
    return pepObj.value[id];
}

const loadData = function () {
    return getDeviceUserListByDeviceId(props.option.item.id);
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
    const item = dataSource.value.filter(item => key === item.id)[0];
    editableData[key] = cloneDeep({
        ...item,
        birthday: item.birthday ? dayjs(item.birthday) : null,
        purEndDate: item.purEndDate ? dayjs(item.purEndDate) : null,
        serviceEndDate: item.serviceEndDate ? dayjs(item.serviceEndDate) : null
    });
}

const deleteItem = (key: number) => {
    createConfirm({
        title: '确定要删除？',
        iconType: 'info',
        onOk: () => {
            deleteDeviceUserByIdApi(key).then(() => {
                const index = dataSource.value.findIndex(item => key === item.id);
                dataSource.value.splice(index, 1);
            })
        }
    })
}

const addSave = async (record: DeviceUserModel) => {
    try {
        const dates = {
            birthday: record.birthday ? dayjs(record.birthday).format('YYYY-MM-DD') : null,
            purEndDate: record.purEndDate ? dayjs(record.purEndDate).format('YYYY-MM-DD') : null,
            serviceEndDate: record.serviceEndDate ? dayjs(record.serviceEndDate).format('YYYY-MM-DD') : null,
        }
        const res = await createDeviceUserApi({
            ...record,
            deviceId: props.option.item.id,
            ...dates
        })
        Object.assign(record, { id: res.id, ...dates });
        // 刷新数据
    } catch (err) {

    }
}

const addDelete = (record: DeviceUserModel) => {
    const index = dataSource.value.findIndex(x => x === record);
    dataSource.value.splice(index, 1);
}

const editSave = async (key: number) => {
    try {
        const newObj = {
            ...editableData[key],
            birthday: editableData[key].birthday ? dayjs(editableData[key].birthday).format('YYYY-MM-DD') : null,
            purEndDate: editableData[key].purEndDate ? dayjs(editableData[key].purEndDate).format('YYYY-MM-DD') : null,
            serviceEndDate: editableData[key].serviceEndDate ? dayjs(editableData[key].serviceEndDate).format('YYYY-MM-DD') : null,
        }
        await updateDeviceUserByIdApi(newObj, newObj.id);
        Object.assign(dataSource.value.filter(item => key === item.id)[0], newObj);
        delete editableData[key];
    } catch (err) {

    }
}

const editCancel = (key: number) => {
    delete editableData[key];
}



// 表单处理
const renewData: UnwrapRef<Record<number, any>> = reactive({})

const renew = (id: number) => {
    renewData[id] = {
        endDate: null,
        visible: true
    };
    console.log(renewData)
}

const renewOk = (id: number) => {
    console.log(renewData);
    if (renewData[id]) {
        const item = dataSource.value.filter(item => id === item.id)[0];
        console.log(item);
        if (item) {
            const newDate = dayjs(renewData[id].endDate).format('YYYY-MM-DD')
            deviceUserRenew({
                duId: item.id,
                oldEndDate: item.serviceEndDate,
                newEndDate: newDate
            }).then(() => {
                Object.assign(dataSource.value.filter(item => id === item.id)[0], {
                    serviceEndDate: newDate
                });
                renewData[id].visible = false;
            })
        }
    }
}

const dateChange = (value: dayjs.Dayjs, id: number) => {
    if (renewData[id]) {
        renewData[id].endDate = value;
    }
}

const visibleChange = (value: boolean, id: number) => {
    if (!value) {
        renewData[id].visible = value;
        delete renewData[id];
    }
}



</script>
<style lang="less" scoped>
.page-container {
    height: 492px;
}
</style>