<template>
    <a-modal :centered="true" :visible="props.visible" :title="props.title" :width="props.width || 520"
        @cancel="handleCancel" @ok="handleOk" :afterClose="afterClose">
        <template v-if="props.component">
            <component :is="props.component"></component>
        </template>
        <template v-else>
            <slot></slot>
        </template>
        <template #footer>
            <template v-if="props.showFooter">
                <a-button key="back" @click="handleCancel">取消</a-button>
                <a-button key="submit" type="primary" :loading="formLoading" @click="handleOk">
                    提交
                </a-button>
            </template>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';

const props = defineProps({
    component: {
        type: Object,
        default: null,
    },
    visible: {
        type: Boolean,
        default: () => false
    },
    formLoading: {
        type: Boolean,
        default: () => false
    },
    title: {
        type: String,
        default: () => ''
    },
    showFooter: {
        type: Boolean,
        default: () => true
    },
    width: [String, Number]
})

console.log(props);

const emits = defineEmits(['cancel', 'ok', 'afterClose'])

const handleOk = () => {
    emits('ok');
}

const handleCancel = () => {
    emits('cancel');
}

const afterClose = () => {
    emits('afterClose');
}
</script>
<style lang="less" scoped></style>