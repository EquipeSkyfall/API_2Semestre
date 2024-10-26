// AdicionarProdutoModal.tsx
import React from 'react';
import './styles.css'; // Importando seu CSS para o modal

interface AdicionarProdutoModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const AdicionarProdutoModal: React.FC<AdicionarProdutoModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-conteudo">
                <button className="botao-fechar" onClick={onClose}>
                    <i className="fas fa-times"></i> {/* Ícone de fechar */}
                </button>
                <div className="modal-corpo">
                    <div className="area-rolavel">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdicionarProdutoModal;
