export interface DeviceModel {
    id?: number;
    sn: string;
    buyPersonName?: string;
    buyPersonPhone?: string;
    createTime?: string;
}

export interface DeviceUserModel {
    id?: number;
    deviceId: number;
    birthday: string;
    serviceEndDate: string;
    purEndDate: string;
}

export interface DeviceAccountModel {

}

export interface UserRenewModel {
    duId: number;
    oldEndDate: string;
    newEndDate: string;
}