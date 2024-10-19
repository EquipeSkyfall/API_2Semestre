import BatchForm from "../components/BatchForm";
import ShipmentForm from "../components/Shippments/CreateShippmentsForm";

export default function Movimentacao() {
    return (
        <>
            <BatchForm refetch={() => { } } />
            <ShipmentForm refetch={() => {}}/>
        </>
    )
}