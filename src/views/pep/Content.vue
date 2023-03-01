<template>
    <CardList class="page-container" :dataSource="dataSource" :pagination="pagination" :loading="false" @reload="reload"
        @tableChange="handleTableChange">
        <template #search>
            <a-form ref="searchFormRef" :model="searchFormState">
                <a-row :gutter="[16, 16]">
                    <a-col :xs="24" :sm="24" :md="12" :lg="6">
                        <a-form-item :label="'套餐名称'" name="name">
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
        <template #cardTitle="{ item }">
            {{ item.name }} - {{ `￥${item.price}` }}
        </template>
        <template #cardContent="{ item }">
            <div class="card-content">
                <!-- {{ item }} -->
                <div v-for="(c, index) in contentFilters(item.content)" class="card-content-item">
                    <span class="orderNo">{{ index + 1 }}.</span>
                    <span class="text">{{ c.value }}</span>
                </div>
                <div v-if="item.content.length > 3">
                    <a @click="openDetail(item)">更多</a>
                </div>
            </div>
        </template>
        <template #cardExtra="{ item }">
            <a-dropdown>
                <a href="#">操作</a>
                <template #overlay>
                    <a-menu>
                        <a-menu-item>
                            <a href="javascript:;" @click="editItem(item)">编辑</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;" @click="deleteItem(item)">删除</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="javascript:;" @click="openDetail(item)">详情</a>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </template>
    </CardList>
    <ContentForm v-if="showForm" :title="formTitle" :formItem="formItem" @close="formClose"></ContentForm>
    <ContentDetail v-if="showDetail" :title="'详情'" :item="detailItem" @close="closeDetail"></ContentDetail>
</template>

<script setup lang="ts">
import { deletePepByIdApi, getPepListApi } from '@/api/pep';
import type { PepModel } from '@/api/pep/model/pepModel';
import { useMessage } from '@/hooks/web/useMessage';
import type { Result } from '@/types/axios';
import { tableShowTotal } from '@/utils/table';
import type { FormInstance } from 'ant-design-vue';
import { computed, reactive, ref } from 'vue';
import { usePagination } from 'vue-request';
import ContentForm from './components/ContentForm.vue';
import ContentDetail from './components/ContentDetail.vue';

const { createConfirm } = useMessage();

defineOptions({
    name: 'PepContent',
});

const searchFormRef = ref<FormInstance>();
const searchFormState = reactive({
    name: ''
})

const loadData = function (params: any) {
    return getPepListApi({
        ...searchFormState,
        ...params
    })
}
const total = ref(0);
const { data: dataSource, run, loading, current, pageSize } = usePagination(loadData, {
    formatResult: (res: Result<PepModel[]>) => {
        total.value = res.total;
        console.log(res);
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

const contentFilters = (arr: any[]) => {
    return arr.slice(0, 3)
}

const search = () => {
    refresh({ num: 1 });
}

const reset = () => {
    searchFormRef.value.resetFields();
    refresh({ num: 1 });
}

const refresh = ({ size, num }: { size?: number, num?: number }) => {
    run({
        pageSize: size || pageSize.value, pageNum: num || current.value
    });
}

const reload = () => {
    refresh({});
}

const handleTableChange = (pag: { pageSize: number; current: number }) => {
    run({
        pageSize: pag.pageSize!,
        pageNum: pag?.current
    })
}

// 表单处理

const showForm = ref(false);
const formType = ref('add');
const formTitle = ref('新增');
const formItem = ref(null);

const addItem = () => {
    showForm.value = true;
    formType.value = 'add';
    formTitle.value = '新增';
    formItem.value = null;
}

const editItem = (record: any) => {
    showForm.value = true;
    formType.value = 'edit';
    formTitle.value = '编辑';
    formItem.value = record;
}

const deleteItem = (record: any) => {
    createConfirm({
        title: '确定要删除？',
        iconType: 'info',
        onOk: () => {
            deletePepByIdApi(record.id).then(() => {
                refresh({});
            })
        }
    })
}

const formClose = (value: string) => {
    showForm.value = false;
    if (value === 'reload') {
        refresh({});
    }
}

const showDetail = ref(false);
const detailItem = ref(null);

const openDetail = (item) => {
    console.log(item);
    showDetail.value = true;
    detailItem.value = item;
}

const closeDetail = () => {
    showDetail.value = false;
}

</script>
<style lang="less" scoped>
.card-content {
    height: 88px;
    overflow: hidden;

    &-item {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
</style>