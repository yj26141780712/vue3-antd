export interface LoginParams {
    userName: string;
    password: string;
    mobile: string;
    code: string
}

export interface LoginResultModel {
    stoken: string;
    ltoken: string;
}
