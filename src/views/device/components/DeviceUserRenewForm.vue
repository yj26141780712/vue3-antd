<template>
    <BaseForm :visible="formVisible" :title="props.option.title" :formLoading="formLoading" @cancel="cancel" @ok="ok"
        @afterClose="afterClose">
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
            <a-row :gutter="[16, 16]">
                <a-col span="24">
                    <a-form-item has-feedback :label="''" v-bind="validateInfos.sn">
                        <a-input v-model:value="modelRef.sn" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'姓名'" v-bind="validateInfos.buyPersonName">
                        <a-input v-model:value="modelRef.buyPersonName" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'姓名'" v-bind="validateInfos.buyPersonName">
                        <a-input v-model:value="modelRef.buyPersonName" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'姓名'" v-bind="validateInfos.buyPersonName">
                        <a-input v-model:value="modelRef.buyPersonName" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </BaseForm>
</template>

<script setup lang="ts">
import type { DeviceModel } from '@/api/sell/model/deviceModel';
import { getObjectValue } from '@/utils/form';
import { Form } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { reactive, ref, onMounted, toRaw } from 'vue';

const props = defineProps({
    option: {
        type: Object,
        default: null
    }
});

const emits = defineEmits(['close']);

onMounted(() => {
    formVisible.value = true;
});

const useForm = Form.useForm;
const formVisible = ref(false);
const modelRef = reactive<DeviceModel>({
    sn: '',
    buyPersonName: '',
    buyPersonPhone: ''
});
const ruleRef: Record<string, Rule[]> = reactive({
    sn: [{ required: true, message: '请输入设备id' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, ruleRef, {});

if (props.option.item) {
    resetFields({ ...getObjectValue(modelRef, props.option.item) });
}

const formLoading = ref(false);
let isOk = false;

const cancel = () => {
    if (formLoading.value === true) {
        return;
    }
    formVisible.value = false;
}

const ok = () => {
    if (formLoading.value === true) {
        return;
    }
    formLoading.value = true;
    validate()
        .then(() => {

        })
        .then(() => {
            isOk = true;
            formLoading.value = false;
            formVisible.value = false;
        })
        .catch(err => {
            console.log('error', err);
            formLoading.value = false;
        });
}

const afterClose = () => {
    emits('close', isOk ? 'reload' : '')
}
</script>
<style lang="less" scoped></style>