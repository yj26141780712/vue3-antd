<template>
    <BaseList :columns="columns" @reload="reload">
        <template #search>
            <a-form>
                <a-row :gutter="[16, 16]">
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item :label="'关键字1'">
                            <a-input></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item>
                            <a-space>
                                <a-button type="primary">搜索</a-button>
                                <a-button type="primary">重置</a-button>
                            </a-space>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </template>
        <template #button>
            <a-button type="primary">新增</a-button>
        </template>
        <!-- <template #table>
                                                    <a-table :columns="[]" :data-source="[]">

                                                    </a-table>
                                                </template> -->
    </BaseList>
</template>

<script setup lang="ts">
import { getCompanyListApi } from '@/api/system';
import useStore from '@/stores';
import type { ColumnType } from 'ant-design-vue/lib/table';
import { reactive, onMounted } from 'vue';

defineOptions({
    name: 'SystemCompany',
});
let columns = reactive<ColumnType[]>([{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
},
{
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
},
{
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
},
{
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
},
{
    title: 'Action',
    key: 'action',
}]);
const { company } = useStore();

onMounted(async () => {
    const res = await getCompanyListApi({
        companyName: 'tet',
    });
    setTimeout(() => {
        columns = [];
        console.log(123);
    }, 1000)
})

const reload = () => {
    console.log('刷新表格！')
}
</script>
<style lang="less" scoped></style>