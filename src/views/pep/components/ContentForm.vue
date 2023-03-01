<template>
    <BaseForm :visible="formVisible" :title="props.title" :formLoading="formLoading" :showScroll="true"
        @cancel="handleCancel" @ok="handleOk" @afterClose="afterClose">
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
            <a-row :gutter="[16, 16]">
                <a-col span="24">
                    <a-form-item has-feedback :label="'套餐名称'" v-bind="validateInfos.name">
                        <a-input v-model:value="modelRef.name" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item has-feedback :label="'套餐价格'" v-bind="validateInfos.price">
                        <a-input-number v-model:value="modelRef.price" :min="1">
                            <template #addonBefore>
                                <span>￥</span>
                            </template>
                        </a-input-number>
                    </a-form-item>
                </a-col>
                <a-col span="24">
                    <a-form-item :label="'套餐内容'" v-bind="validateInfos.content">
                        <a-button type="dashed" style="width: 60%" @click="addNewContent()">
                            添加
                        </a-button>
                    </a-form-item>
                    <template v-for="(item, index) in modelRef.content">
                        <a-form-item has-feedback :label="(index + 1) + '.'" v-bind="validateInfos[item.key]"
                            :colon="false">
                            <a-input v-model:value="modelRef[item.key]" :key="item.key"></a-input>
                            <div class="item-button">
                                <a style="margin-left: 8px;" @click="deleteContent(index)">删除</a>
                            </div>
                        </a-form-item>
                    </template>
                </a-col>
            </a-row>
        </a-form>
    </BaseForm>
</template>

<script setup lang="ts">
import { createPepApi, updatePepByIdApi } from '@/api/pep';
import { getObjectValue } from '@/utils/form';
import { Form } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { reactive, ref, toRaw } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: '添加'
    },
    formItem: {
        type: Object,
        default: null
    },
    afterClose: {
        type: Function,
        default: () => { }
    }
})

const emits = defineEmits(['close']);

interface FormModel {
    name: string;
    price: number;
    content: { key: string, value: string }[];
}

const useForm = Form.useForm;
const formVisible = ref(true);

const formLoading = ref(false);
let formType = ref('add');
let opId = 0;
let isOk = false;


let validateContent = async (_rule: Rule, value: string) => {
    if (value.length === 0) {
        return Promise.reject('请输入套餐内容');
    } else {
        return Promise.resolve();
    }
};

const modelRef = reactive<FormModel>({
    name: '',
    price: 0,
    content: []
})



const ruleRef: Record<string, Rule[]> = reactive({
    name: [{ required: true, message: '请输入套餐名称' }],
    price: [{ required: true, message: '请输入套餐价格' }],
    content: [{ required: true, validator: validateContent, message: '请添加套餐项目' }]
});

const { resetFields, validate, validateInfos } = useForm(modelRef, ruleRef, {
    onValidate: (...args) => console.log(...args),
});

if (props.formItem) {
    resetFields({ ...getObjectValue(modelRef, props.formItem) });
    if (props.formItem.content && Array.isArray(props.formItem.content)) {
        props.formItem.content.forEach(x => {
            modelRef[x.key] = x.value;
            ruleRef[x.key] = [{ required: true, message: '请输入项目内容' }]
        })
    }
}

const addNewContent = () => {
    const key = `content_${Date.now()}`
    modelRef.content.push({ key, value: '' });
    modelRef[key] = '';
    ruleRef[key] = [{ required: true, message: '请输入项目内容' }];
}

const deleteContent = (index: number) => {
    const a = modelRef.content.splice(index, 1);
    if (a[0]) {
        modelRef[a[0].key] = '';
        ruleRef[a[0].key] = [];
    }
}

const handleCancel = () => {
    if (formLoading.value === true) {
        return;
    }
    formVisible.value = false;
}

const handleOk = () => {
    if (formLoading.value === true) {
        return;
    }
    formLoading.value = true;
    validate()
        .then(() => {
            const obj: any = {};
            const raw = toRaw(modelRef);
            for (const key in raw) {
                if (!key.includes('content_')) {
                    obj[key] = raw[key];
                }
            }
            if (Array.isArray(obj.content)) {
                obj.content = JSON.stringify(obj.content.map(((x: any) => {
                    return { ...x, value: raw[x.key] };
                })));
            }
            if (!props.formItem) {
                return createPepApi(obj);
            } else {
                return updatePepByIdApi(props.formItem.id, obj);
            }
        })
        .then((res) => {
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
    console.log('afterClose');
    emits('close', isOk ? 'reload' : '');
}

</script>
<style lang="less" scoped>
.item-button {
    position: absolute;
    top: 6px;
    left: 100%;
    width: 180px;
}
</style>