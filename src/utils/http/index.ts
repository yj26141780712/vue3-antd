import { ResultEnum } from '@/enums/ResultEnum';
import type { RequestOptions, Result } from '@/types/axios';
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import i18n from '@/locals';
import { useMessage } from '@/hooks/web/useMessage';
import { getToken } from '../cache';

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

const { createMessage, createErrorModal, createSuccessModal } = useMessage();

const defaultOption: RequestOptions = {
    isReturnNativeResponse: false,
    isTransformResponse: true,
    errorMessageMode: 'message',
    successMessageMode: 'message'
}


const instance = axios.create({
    baseURL: import.meta.env.VITE_DOMAIN_API
});

instance.interceptors.request.use(function (config) {
    const token = getToken();
    if (token) {
        config.headers['token'] = token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
})

instance.interceptors.response.use(async (response: AxiosResponse<Result>) => {
    const config = response.config;
    if (config.url === '/refreshtoken') {
        return response;
    }
    const { code } = response.data;
    if (code === ResultEnum.ErrorToken || code === ResultEnum.ExpiredToken) {
        //token无效 拦截重新刷新token
        if (!isRefreshing) {
            try {
                isRefreshing = true;
                const res = await refreshToken();
                console.log(res);
                const { code, token } = res.data;
                if (code === 200) {
                    //设置token;
                    config.headers['token'] = token;
                    requests.forEach(cb => cb(token))
                    // 重试完了别忘了清空这个队列
                    requests = []
                    return await instance(config);
                } else {
                    console.log('刷新token失败');
                    window.location.href = `${import.meta.env.BASE_URL}user/login`;
                }
            } catch (err) {
                console.log('刷新token失败', err);
                window.location.href = `${import.meta.env.BASE_URL}user/login`;
            } finally {
                isRefreshing = false;
            }
        } else {
            return new Promise((resolve) => {
                requests.push((token: string) => {
                    config.headers['token'] = token
                    resolve(instance(config))
                });
            })
        }
    }
    return response;
}, function (error) {
    return Promise.reject(error);
})

const refreshToken = async function () {
    const res = await instance.request({ method: 'get', url: '/refreshtoken' });
    instance.interceptors.response
    return res.data;
}

const transformRequestHook = function (res: AxiosResponse<Result>, options: RequestOptions) {
    const { t } = i18n.global;
    const { isReturnNativeResponse, isTransformResponse } = options;
    if (isReturnNativeResponse) {
        return res;
    }
    if (!isTransformResponse) {
        return res.data;
    }
    const { data } = res;
    if (!data) {
        throw new Error(t('sys.api.apiRequestFailed'));
    }
    const { code, message } = data;
    if (code === ResultEnum.Ok) {
        console.log(123);
        if (message && options.successMessageMode === 'modal') {
            createSuccessModal({ content: message });
        }
        if (message && options.successMessageMode === 'message') {
            createMessage.success(message || '操作成功！');
        }

        return data.data;
    } else {
        if (message && options.errorMessageMode === 'modal') {
            createErrorModal({ content: message });
        }
        if (message && options.errorMessageMode === 'message') {
            createMessage.error(message);
        }
        throw new Error(message);
    }
}

const setHeader = () => {

}

const get = async function <T = any>(conf: AxiosRequestConfig<any>, options?: RequestOptions): Promise<T> {
    return request({ ...conf, method: 'GET' }, options)
}

const post = async function <T = any>(conf: AxiosRequestConfig<any>, options?: RequestOptions): Promise<T> {
    return request({ ...conf, method: 'POST' }, options)
}

const request = async function <T = any>(conf: AxiosRequestConfig<any>, options?: RequestOptions): Promise<T> {
    options = { ...defaultOption, ...options };
    try {
        const res = await instance.request(conf);
        return await Promise.resolve(transformRequestHook(res, options));
    } catch (err: any | AxiosError) {
        if (axios.isAxiosError(err)) {

        }
        return await Promise.reject(err);
    }
}


export const http = {
    get,
    post,
    request,
    setHeader
}
