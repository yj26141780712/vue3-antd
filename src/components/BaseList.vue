<template>
    <div class="page-container">
        <div class="table-search">
            <slot name="search"></slot>
        </div>
        <div class="table-body">
            <div class="table-tool">
                <div class="table-tool-left">
                    <slot name="button"></slot>
                </div>
                <div class="table-tool-right">
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>刷新</template>
                            <icon-font type="icon-reload" @click="emit('reload')"></icon-font>
                        </a-tooltip>

                    </div>
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>密度</template>
                            <a-popover placement="bottomRight" :trigger="'click'">
                                <icon-font type="icon-column-height"></icon-font>
                                <template #content>
                                    <a-menu style="width: 80px;">
                                        <a-menu-item>默认</a-menu-item>
                                        <a-menu-item>中等</a-menu-item>
                                        <a-menu-item>紧凑</a-menu-item>
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
                                        <a-menu-item v-for="(item) in checkedList" :key="item.key">
                                            <a-checkbox v-model:checked="item.checked">{{
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
                            <icon-font type="icon-fullscreen"></icon-font>
                        </a-tooltip>
                    </div>
                    <div class="table-tool-setting-item">
                        <a-tooltip>
                            <template #title>搜索</template>
                            <icon-font type="icon-search"></icon-font>
                        </a-tooltip>
                    </div>
                </div>
            </div>
            <div class="table-warpper">
                <slot v-if="customTable" name="table"></slot>
                <a-table :columns="selectedColumns" :data-source="dataSrouce">

                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BaseTableColumn } from '@/types/table';
import { onMounted, reactive, ref, computed, watch } from 'vue';
const props = defineProps({
    customTable: {
        type: Boolean,
        default: false
    },
    columns: {
        type: Array,
        default: ():BaseTableColumn[] => []
    },
    dataSrouce:{
        type: Array,
        default: () => []
    }
})

const selectedColumns = computed(() => {
     return checkedList.filter(x=>x.checked);
});

const emit = defineEmits(['reload'])
const indeterminate = ref(false);
const checkAll = ref(true);

let checkedList = reactive<BaseTableColumn[]>(
    [...props.columns.map((x: any) => Object.assign({},x,{checked:true}))]);

const onCheckAllChange = () => {

}


watch(()=>props.columns,(val)=>{
    checkedList = [...val.map((x: any) => Object.assign({},x,{checked:true}))]
})



</script>
<style lang="less" scoped></style>