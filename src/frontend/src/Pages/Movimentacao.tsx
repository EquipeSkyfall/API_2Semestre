import BatchForm from "../components/BatchForm";
import ShipmentForm from "../components/Shippments/CreateShippmentsForm";

export default function Movimentacao() {
    return (
        <div>
            <div>
                <BatchForm refetch={() => { }} />
            </div>
            <div>
                <ShipmentForm refetch={() => { }} />
            </div>
        </div>
    );
}
