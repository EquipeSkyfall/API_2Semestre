import BatchForm from "../components/BatchForm";
import ShipmentForm from "../components/Shippments/CreateShippmentsForm";
import styles from './../components/Movimentacao.module.css'; // Ajuste o caminho conforme necessário

export default function Movimentacao() {
    return (
        <div className={styles.formContainer}>
            <div className={styles.insertProducts}>
                <BatchForm refetch={() => { }} />
            </div>
            <div className={styles.dropProducts}>
                <ShipmentForm refetch={() => { }} />
            </div>
        </div>
    );
}
