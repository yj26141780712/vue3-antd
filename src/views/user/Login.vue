
<template>
    <a-form :model="formState">
        <a-tabs v-model:activeKey="activeKey" centered="true">
            <a-tab-pane key="tab1" tab="账号密码登录">
                <a-form-item name="userName">
                    <a-input v-model:value="formState.userName" type="text" :placeholder="$t('login.userName')"
                        size="large">
                        <template #prefix>
                            <user-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item name="password">
                    <a-input v-model:value="formState.password" :type="isShowPassword ? 'text' : 'password'"
                        autocomplete="off" :placeholder="$t('login.password')" size="large">
                        <template #prefix>
                            <lock-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                        </template>
                        <template #suffix>
                            <eye-outlined v-if="isShowPassword" @click="isShowPassword = !isShowPassword" />
                            <eye-invisible-outlined v-else="!isShowPassword"
                                @click="isShowPassword = !isShowPassword" />
                        </template>
                    </a-input>
                </a-form-item>
            </a-tab-pane>
            <a-tab-pane key="tab2" tab="手机号登录" force-render>
                <a-form-item name="mobile">
                    <a-input v-model:value="formState.mobile" type="text" :placeholder="$t('login.mobile')"
                        size="large" />
                </a-form-item>
                <a-row gutter="16">
                    <a-col span="16">
                        <a-form-item name="code">
                            <a-input v-model:value="formState.code" type="text" autocomplete="off"
                                :placeholder="$t('login.code')" size="large" />
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-button size="large" block>{{ $t('login.getCode') }}</a-button>
                    </a-col>
                </a-row>
            </a-tab-pane>
        </a-tabs>
        <a-form-item>
            <a-checkbox>{{ $t('login.autoLogin') }}</a-checkbox>
            <router-link :to="{ name: 'recover' }" class="forge-password" style="float: right;">{{
                $t('login.forgotPassword')
            }}</router-link>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" size="large" html-type="submit" block @click="onSubmit">确定</a-button>
        </a-form-item>
        <a-form-item>
            <router-link :to="{ name: 'register' }" class="forge-password" style="float: right;">{{
                $t('login.register')
            }}</router-link>
        </a-form-item>
    </a-form>
</template>
<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { reactive, ref } from 'vue'
interface FormState {
    userName: string;
    password: string;
    mobile: string;
    code: string;
}
const activeKey = ref('tab1')
const formRef = ref<FormInstance>()
const formState = reactive<FormState>({
    userName: '',
    password: '',
    mobile: '',
    code: ''
})
const isShowPassword = ref(false);
const onSubmit = () => {
    console.log('handleSubmit');
}
</script>