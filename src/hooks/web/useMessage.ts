import { isString } from "@vueuse/core";
import { message, Modal, type ModalFuncProps } from "ant-design-vue";
import { h } from "vue";
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons-vue';
import i18n from '@/locals';

declare type ModalIconType = 'warning' | 'success' | 'error' | 'info'

declare type ModalOptionsEx = { iconType: ModalIconType }
    & Omit<ModalFuncProps, 'iconType'>

export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

const renderContent = function ({ content }: Pick<ModalOptionsEx, 'content'>) {
    try {
        if (isString(content)) {
            return h('div', h('div', { 'innerHTML': content as string }));
        } else {
            return content;
        }
    } catch (e) {
        return content;
    }
}

const getIcon = function (iconType: ModalIconType) {
    if (iconType === 'success') {
        return h(CheckCircleFilled, { "class": "modal-icon-success" })
    } else if (iconType === 'error') {
        return h(CloseCircleFilled, { "class": "modal-icon-error" })
    } else if (iconType === 'info') {
        return h(InfoCircleFilled, { "class": "modal-icon-info" })
    } else if (iconType === 'warning') {
        return h(ExclamationCircleFilled, { "class": "modal-icon-warning" })
    }
    // createVNode(ExclamationCircleOutlined)
}

const getBaseOptions = () => {
    const { t } = i18n.global;
    return {
        okText: t('common.okText'),
        centered: true,
    };
};

const createConfirm = function (props: ModalOptionsEx) {
    Modal.success({
        ...props,
        ...getBaseOptions(),
        icon: getIcon(props.iconType),
        content: renderContent(props)
    })
}

function createModalOptions(options: ModalFuncProps, icon: ModalIconType): ModalFuncProps {
    return {
        ...getBaseOptions(),
        ...options,
        content: renderContent(options),
        icon: getIcon(icon),
    };
}

const createSuccessModal = function (props: ModalOptionsPartial) {
    return Modal.success(createModalOptions(props, 'success'));
}

const createErrorModal = function (props: ModalOptionsPartial) {
    return Modal.error(createModalOptions(props, 'error'));
}

const createInfoModal = function (props: ModalOptionsPartial) {
    return Modal.error(createModalOptions(props, 'info'));
}

const createWarningModal = function (props: ModalOptionsPartial) {
    return Modal.error(createModalOptions(props, 'warning'));
}

export function useMessage() {
    return {
        createMessage: message,
        createConfirm,
        createSuccessModal,
        createErrorModal,
        createInfoModal,
        createWarningModal
    };
}