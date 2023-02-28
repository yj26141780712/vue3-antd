<template>
    <BaseForm :visible="formVisible" :title="props.option.title" :formLoading="formLoading" @cancel="cancel" @ok="ok"
        @afterClose="afterClose">
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
            <a-row :gutter="[16, 16]">
                <a-col span="24">
                    <a-form-item has-feedback :label="'设备id'" v-bind="validateInfos.sn">
                        <a-input v-model:value="modelRef.sn" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </BaseForm>
</template>

<script setup lang="ts">
import type { DeviceModel } from '@/api/sell/model/deviceModel';
import { Form } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { reactive, ref, onMounted } from 'vue';

const props = defineProps({
    option: {
        type: Object,
        default: null
    }
});

const emits = defineEmits(['close']);

onMounted(() => {
    formVisible.value = true;
    console.log(123);
});

const useForm = Form.useForm;
const formVisible = ref(false);
const modelRef = reactive<DeviceModel>({
    sn: ''
});
const ruleRef: Record<string, Rule[]> = reactive({
    sn: [{ required: true, message: '请输入设备id' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, ruleRef, {});

const formLoading = ref(false);
let formType = ref('add');
let opId = 0;


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

            if (formType.value === 'add') {
                return createRoleApi(toRaw(modelRef));
            } else {
                return updateRoleByIdApi(opId, toRaw(modelRef));
            }
        })
        .then((res) => {
            console.log(checkedKeys.value);
            console.log(res);
            formLoading.value = false;
            formVisible.value = false;
            refresh({});
        })
        .catch(err => {
            console.log('error', err);
            formLoading.value = false;
        });
}

const afterClose = () => {
    emits('close')
}
</script>
<style lang="less" scoped></style>