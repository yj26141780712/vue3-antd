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
                <div v-if="showRightTool" class="table-tool-right">
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>刷新</template>
                            <icon-font type="icon-reload" @click="reload"></icon-font>
                        </a-tooltip>

                    </div>
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>密度</template>
                            <a-popover v-model:visible="sizeShow" placement="bottomRight" :trigger="'click'"
                                :overlayClassName="'table-popover'">
                                <icon-font type="icon-column-height"></icon-font>
                                <template #content>
                                    <a-menu style="width: 80px;">
                                        <a-menu-item key="'default'" @click="selectSize('default')">默认</a-menu-item>
                                        <a-menu-item key="'middle'" @click="selectSize('middle')">中等</a-menu-item>
                                        <a-menu-item key="'small'" @click="selectSize('small')">紧凑</a-menu-item>
                                    </a-menu>
                                </template>
                            </a-popover>
                        </a-tooltip>
                    </div>
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>列设置</template>
                            <a-popover placement="bottomRight" :trigger="'click'" :overlayClassName="'table-popover'">
                                <icon-font type="icon-setting"></icon-font>
                                <template #content>
                                    <a-menu style="min-width: 180px;" :selectable="false">
                                        <a-menu-item>
                                            <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate"
                                                @change="onCheckAllChange">
                                                全选
                                            </a-checkbox>
                                        </a-menu-item>
                                        <a-divider style="margin: 4px 0;"></a-divider>
                                        <a-menu-item v-for="(item) in checkedColumnKeys" :key="item.key">
                                            <a-checkbox v-model:checked="item.checked" @change="onCheckChange">{{
                                                item.title
                                            }}</a-checkbox>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-popover>
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
                <a-table :columns="selectedColumns" :data-source="dataSource" :size="tableSize" :loading="loading"
                    :pagination="props.pagination" :scroll="showScroll ? scroll : {}" @change="handleTableChange">
                    <template #headerCell="{ column }">
                        <slot name="headerCell" :column="column">
                            {{ column.title }}
                        </slot>
                    </template>
                    <template #bodyCell="{ column, record }">
                        <slot name="bodyCell" :column="column" :record=record></slot>
                    </template>
                    <!-- <template v-if="props.expandedRowRender" #expandedRowRender>

                    </template> -->
                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BaseTableColumn } from '@/types/table';
import { reactive, ref, computed, watch } from 'vue';
import { exitFullScreen, isFullscreenForNoScroll, openFullscreen } from '@/utils/common/fullscreen';
import type { TableProps } from 'ant-design-vue';
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
    expandedRowRender: {
        type: Boolean,
        default: false
    },
    dataSource: {
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
    },
    showRightTool: {
        type: Boolean,
        default: true
    }
})

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
        x: props.columns.reduce(((p: any, c: any) => (c.width || 60) + p), 0),
        y: isFullScreen.value ? windowHeight :
            (windowHeight - tableOtherHeight
                - (themeSetting.value.showManytabs ? tableTabsHeight : 0)
                - (showSearch.value ? (props.options.searchToolHeight || 80) : 12)
                - (themeSetting.value.showFooter ? 46 : 0))
    };
})

console.log(scroll.value)

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

const handleTableChange: TableProps['onChange'] = (
    pag: { pageSize: number; current: number },
    filters: any,
    sorter: any,
) => {
    emit('tableChange', pag, filters, sorter)
};

watch(() => props.columns, (val) => {
    console.log(val)
    // checkedList = [...val.map((x: any) => Object.assign({}, x, { checked: true }))]
})

</script>
<style lang="less" scoped></style>