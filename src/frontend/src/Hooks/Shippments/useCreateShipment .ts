// Hooks/Shipment/useCreateShipment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ShipmentSchema } from '../../components/Shippments/CreateShippmentsForm/CreateShipmentSchema/shipmentSchema';

interface Product {
  id_produto: number;
  id_lote: number;
  quantidade_retirada: number;
}

interface ShipmentData {
  motivo_saida: string;
  produtos: Product[];
}

const createShipment = async (shipmentData: ShipmentData) => {
    console.log(shipmentData)
  const response = await axios.post('http://127.0.0.1:3000/shipments', shipmentData,{withCredentials: true});
  return response.data;
};

const useCreateShipment = (onSuccessCallback: (data: ShipmentSchema) => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    {mutationFn:createShipment, 
        onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); 
      console.log('Shipment registered successfully.');
      onSuccessCallback(data);
    },
    onError: (error) => {
      console.error('Error registering shipment:', error);
    },
  });
};

export default useCreateShipment;
