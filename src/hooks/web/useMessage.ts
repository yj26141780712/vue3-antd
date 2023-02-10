import { message } from "ant-design-vue";

export function useMessage() {
    return {
        createMessage: message
    };
}