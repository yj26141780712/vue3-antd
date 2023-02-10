export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
    // 错误消息提示类型
    errorMessageMode?: ErrorMessageMode;
    // 成功消息提示类型
    successMessageMode?: SuccessMessageMode;
    // 是否返回原生请求头
    isReturnNativeResponse?: boolean;
    // 是否处理请求结果
    isTransformResponse?: boolean;
}

export interface Result {
    code: ResultEnum;
    message: string;
    data: any
}

