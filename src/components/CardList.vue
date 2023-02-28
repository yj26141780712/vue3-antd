<template>
    <div>
        <div v-if="showSearch" class="table-search">
            <slot name="search"></slot>
        </div>
        <div class="table-body" ref="baseTable">
            <div class="table-tool">
                <div class="table-tool-left">
                    <slot name="button"></slot>
                </div>
                <div class="table-tool-right">
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>刷新</template>
                            <icon-font type="icon-reload" @click="reload"></icon-font>
                        </a-tooltip>
                    </div>
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>放大</template>
                            <icon-font :type="isFullScreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
                                @click="fullscreen"></icon-font>
                        </a-tooltip>
                    </div>
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>搜索</template>
                            <icon-font type="icon-search" @click="hideSearch"></icon-font>
                        </a-tooltip>
                    </div>
                </div>
            </div>
            <div class="table-warpper">
                <a-spin tip="Loading..." :spinning="props.loading">
                    <a-empty v-if="showEmpty" :image="simpleImage" />
                    <a-row :gutter="[16, 16]">
                        <a-col v-for="(item, index) in dataSrouce" :xs="24" :sm="24" :md="12" :lg="8">
                            <a-card style="width: 300px">
                                <template #title>
                                    <slot name="cardTitle" :item="item"></slot>
                                </template>
                                <template #extra>
                                    <slot name="cardExtra" :item="item"></slot>
                                </template>

                                <template #default>
                                    <slot name="cardContent" :item="item"></slot>
                                </template>
                            </a-card>
                        </a-col>
                    </a-row>
                </a-spin>
                <a-pagination v-model:current="pagination.current" v-model:page-size="pagination.pageSize"
                    :total="pagination.total" :show-total="pagination.showTotal"
                    :showQuickJumper="pagination.showQuickJumper" :showSizeChanger="pagination.showSizeChanger"
                    @change="pageChange" @showSizeChange="pageShowSizeChange"
                    class="ant-pagination ant-table-pagination ant-table-pagination-right" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BaseTableColumn } from '@/types/table';
import { reactive, ref, computed, watch } from 'vue';
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from '@/utils/common/fullscreen';
import { Empty, type TableProps } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import useStore from '@/stores';
import { tableOtherHeight, tableTabsHeight } from '@/utils/table';
const { theme } = useStore();
const { themeSetting } = storeToRefs(theme);

interface BaseListOption {
    searchToolHeight: number
}

const props = defineProps({
    customTable: {
        type: Boolean,
        default: false
    },
    columns: {
        type: Array,
        default: (): BaseTableColumn[] => []
    },
    dataSrouce: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    showScroll: {
        type: Boolean,
        default: false
    },
    options: {
        type: Object,
        default: {} as BaseListOption
    },
    pagination: {
        type: [Object, Boolean],
        default: false
    }
})

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const showEmpty = computed(() => {
    return !(props.dataSrouce && props.dataSrouce.length > 0);
});

const baseTable = ref(null);
const sizeShow = ref(false);
const tableSize = ref('default');
const showSearch = ref(true);
const emit = defineEmits(['reload', 'tableChange', 'showSearch'])
const indeterminate = ref(false);
const checkAll = ref(true);
let checkedColumnKeys = reactive<any[]>([
    ...props.columns.map((x: BaseTableColumn) => { return { key: x.key as string, title: x.title, checked: true } })
]);


const selectedColumns = computed(() => {
    return props.columns.filter((x: any) =>
        checkedColumnKeys.some(y => y.key === x.dataIndex && y.checked));
});

const isFullScreen = ref(false);
const windowHeight = window.innerHeight;
const scroll = computed(() => {
    return {
        x: props.columns.reduce(((p: any, c) => (p.width || 60) + c), 0),
        y: isFullScreen.value ? windowHeight :
            (windowHeight - tableOtherHeight
                - (themeSetting.value.showManytabs ? tableTabsHeight : 0)
                - (showSearch.value ? (props.options.searchToolHeight || 80) : 12)
                - (themeSetting.value.showFooter ? 46 : 0))
    };
})


const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
        checkedColumnKeys.forEach(x => {
            x.checked = true;
        });
        indeterminate.value = false;
    } else {
        checkedColumnKeys.forEach(x => {
            x.checked = false;
        })
        indeterminate.value = false;
    }
}

const onCheckChange = () => {
    console.log(checkedColumnKeys)
    checkAll.value = checkedColumnKeys.every(x => x.checked);
    indeterminate.value = checkAll.value ? false : checkedColumnKeys.some(x => x.checked);
    console.log(checkAll.value, indeterminate.value);
}

const selectSize = (size: string) => {
    tableSize.value = size;
}

const reload = () => {
    console.log(props.loading);
    if (props.loading) {
        return;
    }
    emit('reload');
}

const fullscreen = () => {

    if (isFullscreenForNoScroll()) {
        isFullScreen.value = false;
        exitFullScreen();

    } else {
        isFullScreen.value = true;
        openFullscreen(baseTable.value);
    }

}

const hideSearch = () => {
    showSearch.value = !showSearch.value;
    emit('showSearch', showSearch.value);
}


// 分页器
let pagination = ref({
    total: 0,
    current: 1,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: null
});

const pageChange = (page: number, pageSize: number) => {
    emit('tableChange', { current: page, pageSize: pageSize })
}

const pageShowSizeChange = (current: number, size: number) => {
    emit('tableChange', { current, pageSize: size })
}

watch(() => props.pagination, (newVal) => {
    pagination = newVal
})

</script>
<style lang="less" scoped></style>