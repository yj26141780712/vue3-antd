export const mailReg = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export const phoneReg = new RegExp(/^(?:(?:\+|00)86)?1\d{10}$/)

export const accountReg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{6,20}$/);

export const passwordReg = new RegExp(/^[0-9a-zA-Z]{6,20}$/);