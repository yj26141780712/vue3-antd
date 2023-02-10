
<template>
    <a-form :model="formState" :rules="rules" @finish="finish">
        <a-tabs v-model:activeKey="activeKey" :centered="true" @change="tabsChange">
            <a-tab-pane key="account" tab="账号密码登录">
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
            <a-tab-pane key="mobile" tab="手机号登录" force-render>
                <a-form-item name="mobile">
                    <a-input v-model:value="formState.mobile" type="text" :placeholder="$t('login.mobile')"
                        size="large">
                        <template #prefix>
                            <mobile-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-row :gutter="16">
                    <a-col span="16">
                        <a-form-item name="code">
                            <a-input v-model:value="formState.code" type="text" autocomplete="off"
                                :placeholder="$t('login.code')" size="large">
                                <template #prefix>
                                    <mail-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                                </template>
                            </a-input>
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
            <a-button type="primary" size="large" html-type="submit" block :loading="loading"
                @click="onSubmit">确定</a-button>
        </a-form-item>
        <a-form-item>
            <router-link :to="{ name: 'register' }" class="forge-password" style="float: right;">{{
                $t('login.register')
            }}</router-link>
        </a-form-item>
    </a-form>
</template>
<script setup lang="ts">
import { LoginType } from '@/enums/loginEnum';
import useStore from '@/stores';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form/interface';
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n';

interface FormState {
    userName: string;
    password: string;
    mobile: string;
    code: string;
}

const loading = ref(false);
const isShowPassword = ref(false);
const activeKey = ref(LoginType.AccountLogin);
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
    userName: '',
    password: '',
    mobile: '',
    code: ''
});

const { t } = useI18n();
const { user } = useStore();

const rules: Record<string, Rule[]> = reactive({
    userName: [{ required: true, message: t('login.userNameRequired') }],
    password: [{ required: true, message: t('login.passwordRequired') }],
    mobile: [{ required: false, message: t('login.mobileRequired') }],
    code: [{ required: false, message: t('login.codeRequired') }]
});

const tabsChange = () => {
    rules.userName[0].required = activeKey.value === LoginType.AccountLogin;
    rules.password[0].required = activeKey.value === LoginType.AccountLogin;
    rules.mobile[0].required = activeKey.value === LoginType.CodeLogin;
    rules.code[0].required = activeKey.value === LoginType.CodeLogin;
}
const onSubmit = () => {
    console.log('handleSubmit');
    console.log(activeKey);
    console.log(rules);
    loading.value = true;
}



const finish = async function () {
    try {
        const res = await user.login(formState, activeKey.value);
        console.log(res);
        loading.value = false;
    } catch (err) {
        console.log(err);
        loading.value = false;
    }
}
</script>