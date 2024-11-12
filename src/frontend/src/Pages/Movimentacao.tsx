import BatchForm from "../components/BatchForm";
import ShipmentForm from "../components/Shippments/CreateShippmentsForm";
import React, { useState } from 'react';

/*import styles from './../components/Shippments/Movimentacao.module.css'; // Ajuste o caminho conforme necessário
Esse import pode ser removido */

export default function Movimentacao() {
    const [activeTab, setActiveTab] = useState('batch'); 

    const styles = {
        formContainer: {
            padding: '2%',
        },
        tabButtons: {
            display: 'flex',
            marginBottom: '1%',
        },
        button: {
            marginLeft: '2%',
            padding: '0.5% 1%',
            marginRight: '0.5%',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#f0f0f0',
            borderRadius: '2%',
        },
        activeButton: {
            backgroundColor: '#38bdf8',
            color: 'white',
        },
        tabContent: {
            padding: '2%',
        },
        insertProducts: {
            marginBottom: '2%',
        },
        dropProducts: {
            marginBottom: '2%',
        },
    };

    return (
        <div style={styles.formContainer}>
            <div style={styles.tabButtons}>
                <button
                    style={activeTab === 'batch' ? { ...styles.button, ...styles.activeButton } : styles.button}
                    onClick={() => setActiveTab('batch')}
                    className="!rounded"
                >
                    Entrada de Produtos
                </button>
                <button
                    style={activeTab === 'shipment' ? { ...styles.button, ...styles.activeButton } : styles.button}
                    onClick={() => setActiveTab('shipment')}
                    className="!rounded"
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
