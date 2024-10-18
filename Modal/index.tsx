import React from 'react';
import './Modal.css'; // Import your CSS for the modal

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <i className="fas fa-times"></i> {/* FontAwesome icon */}
                </button>
                <div className="modal-body">
                    <div className="scrollable-area">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
