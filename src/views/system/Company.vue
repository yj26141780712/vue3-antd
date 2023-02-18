<template>
    <BaseList :columns="columns" :dataSrouce="dataSrouce" @reload="reload">
        <template #search>
            <a-form :model="formState">
                <a-row :gutter="[16, 16]">
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item :label="'公司名称'">
                            <a-input v-model="formState.companyName"></a-input>
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
            <a-button type="primary">新增</a-button>
        </template>
    </BaseList>
</template>

<script setup lang="ts">
import { getCompanyListApi } from '@/api/system';
import type { CompanyModel } from '@/api/system/model/company';
import useStore from '@/stores';
import type { ColumnType } from 'ant-design-vue/lib/table';
import { reactive, onMounted } from 'vue';

interface FormState {
  companyName: string;
}

defineOptions({
    name: 'SystemCompany',
});

const formState = reactive<FormState>({
    companyName:''
})

let columns = reactive<ColumnType[]>([{
    title: 'Name',
    dataIndex: 'companyName',
    key: 'companyName',
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
let dataSrouce = reactive<CompanyModel[]>([
    { companyName:'1' },
    { companyName:'2'},
])

const { company } = useStore();

onMounted(async () => {
    // const res = await getCompanyListApi({
    //     companyName: 'tet',
    // });
})

const search = ()=>{

}

const reset = ()=>{

}

const reload = () => {
    console.log('刷新表格！')
}

async function  loadData () {
    const res = await getCompanyListApi({
        companyName: 'tet',
    });
}

</script>
<style lang="less" scoped></style>