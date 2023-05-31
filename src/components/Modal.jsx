import React, { ReactElement, useEffect } from 'react';
import "./Modal.css"
// интерфейс для пропсов
interface ModalProps {
    visible: boolean;
    title: string;
    content: ReactElement | string;
    footer: ReactElement | string;
    onClose: () => void;
}

const Modal = ({
                   visible = tr,
                   title = '',
                   content = '',
                   footer = '',
                   onClose,
               }: ModalProps) => {
    const onKeydown = ({ key }) => {
        switch (key) {
            case 'Escape':
                onClose();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeydown);
        return () => document.removeEventListener('keydown', onKeydown);
    }, []);

    if (!visible) return null;

    return (
        <div className='modal' onClick={onClose}>
            <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3 className='modal-title'>{title}</h3>
                    <span className='modal-close' onClick={onClose}>
            &times;
          </span>
                </div>
                <div className='modal-body'>
                    <div className='modal-content'>{content}</div>
                </div>
                {footer && <div className='modal-footer'>{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;