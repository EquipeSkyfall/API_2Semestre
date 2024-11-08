import React, { ReactNode } from 'react';
import './editmodal.css';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: ReactNode;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div className="overlay-fundo">
            <div className="conteudo-modal-edit">
                <button className="botao-fechar-produto" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="corpo-modal-edit">
                    <div className="area-scroll-edit">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
