import BatchForm from "../components/BatchForm";
import ShipmentForm from "../components/Shippments/CreateShippmentsForm";
import React, { useState } from 'react';

/*import styles from './../components/Shippments/Movimentacao.module.css'; // Ajuste o caminho conforme necessário
Esse import pode ser removido */

export default function Movimentacao() {
    const [activeTab, setActiveTab] = useState('batch'); // Estado para gerenciar a aba ativa

    // Estilos inline
    const styles = {
        formContainer: {
            padding: '20px',
        },
        tabButtons: {
            display: 'flex',
            marginBottom: '1rem',
        },
        button: {
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
        },
        activeButton: {
            backgroundColor: '#007bff',
            color: 'white',
        },
        tabContent: {
            padding: '20px',
        },
        insertProducts: {
            marginBottom: '20px',
        },
        dropProducts: {
            marginBottom: '20px',
        },
    };

    return (
        <div style={styles.formContainer}>
            <div style={styles.tabButtons}>
                <button
                    style={activeTab === 'batch' ? { ...styles.button, ...styles.activeButton } : styles.button}
                    onClick={() => setActiveTab('batch')}
                >
                    Entrada de Proutos
                </button>
                <button
                    style={activeTab === 'shipment' ? { ...styles.button, ...styles.activeButton } : styles.button}
                    onClick={() => setActiveTab('shipment')}
                >
                    Saida de Produtos
                </button>
            </div>
            <div style={styles.tabContent}>
                {activeTab === 'batch' && (
                    <div style={styles.insertProducts}>
                        <BatchForm refetch={() => { }} />
                    </div>
                )}
                {activeTab === 'shipment' && (
                    <div style={styles.dropProducts}>
                        <ShipmentForm refetch={() => { }} />
                    </div>
                )}
            </div>
        </div>
    );
}
