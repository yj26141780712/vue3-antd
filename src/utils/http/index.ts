import type { RequestOptions, Result } from '@/types/axios';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_DOMAIN_API,
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
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

const transformRequestHook = function (res: AxiosResponse<Result>) {

}

const setHeader = () => {

}

const get = async function (conf: AxiosRequestConfig<any>, options: RequestOptions) {
    return request({ ...conf, method: 'GET' }, options)
}

const post = async function (conf: AxiosRequestConfig<any>, options: RequestOptions) {
    return request({ ...conf, method: 'POST' }, options)
}

const request = async function (conf: AxiosRequestConfig<any>, options: RequestOptions) {
    try {
        const res = await instance.request(conf);
        transformRequestHook(res);
        return [null, res.data];
    } catch (e) {
        return [e];
    }
}

export const http = {
    get,
    post,
    request,
    setHeader
}
