<template>
    <a-modal :centered="true" :visible="props.visible" :title="props.title" :width="props.width || 520"
        @cancel="handleCancel" @ok="handleOk">
        <slot></slot>
        <template #footer>
            <a-button key="back" @click="handleCancel">{{ t('common.cancel') }}</a-button>
            <a-button key="submit" type="primary" :loading="formLoading" @click="handleOk">{{ t('common.submit')
            }}</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
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
    width: [String, Number]
})


const emits = defineEmits(['cancel', 'ok'])

watch(() => props.visible, newVal => {
    console.log(newVal);
})

const { t } = useI18n()


const handleOk = () => {
    emits('ok')
}

const handleCancel = () => {
    emits('cancel')
}
</script>
<style lang="less" scoped></style>