import { ResultEnum } from '@/enums/ResultEnum';
import type { RequestOptions, Result } from '@/types/axios';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import i18n from '@/locals';
import { useMessage } from '@/hooks/web/useMessage';

const { createMessage } = useMessage();

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
    console.log(config)
    return config;
}, function (error) {
    return Promise.reject(error);
})

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
})

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
        if (message && options.successMessageMode) {
            createMessage.success('操作成功！');
        }
        return data.data;
    } else {
        if (message && options.errorMessageMode) {
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
    } catch (err) {
        console.log(err);
        return await Promise.reject(err);
    }
}


export const http = {
    get,
    post,
    request,
    setHeader
}
