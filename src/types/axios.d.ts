export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
    // 错误消息提示类型
    errorMessageMode?: ErrorMessageMode;
    // 成功消息提示类型
    successMessageMode?: SuccessMessageMode;
}

export interface Result {
    code: string;
    message: string;
    data: any
}