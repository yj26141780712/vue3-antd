
export const validateReg = async (value: string, reg: RegExp, message = '请输入正确的内容！') => {
    if (value) {
        console.log(reg, value);
        if (!reg.test(value)) {

            return Promise.reject(message);
        }
    }
    return Promise.resolve();
}