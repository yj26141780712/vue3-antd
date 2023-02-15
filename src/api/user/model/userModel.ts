export interface LoginParams {
    userName: string;
    password: string;
    mobile: string;
    code: string
}

export interface LoginResultModel {
    token: string;
    refreshToken?: string;
}
