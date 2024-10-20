import React, { useState, FormEvent } from 'react';
import useGetProductBatches from '../../../Hooks/Shippments/useGetProductBatches';
import ShipmentProducts from '../ShipmentProducts';
import { ShipmentProductSchema, shipmentSchema, ShipmentSchema } from './CreateShipmentSchema/shipmentSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateShipment from '../../../Hooks/Shippments/useCreateShipment ';
import './styles.css'
interface ProductFormProps {
  refetch: () => void;
}

const ShipmentForm: React.FC<ProductFormProps> = ({ refetch }) => {
  const [shipmentProducts, setShipmentProducts] = useState<{ id_produto: number, nome_produto: string, quantidade_estoque: number }[]>([]);
  const [batchSelections, setBatchSelections] = useState<ShipmentProductSchema[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [removedProductId, setRemovedProductId] = useState<number | null>(null);
  const batchIds = shipmentProducts.map(product => product.id_produto);
  const batchResults = useGetProductBatches(batchIds); // Use the selected product IDs for batches
  const [resetKey, setResetKey] = useState<number>(0);
  const [checkedBatches, setCheckedBatches] = useState<number[]>([])

  const methods = useForm<ShipmentSchema>({
    resolver: zodResolver(shipmentSchema),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, setValue } = methods

  // Handle the selected products from the child component
  const handleProductsSelected = (products: { id_produto: number; nome_produto: string; quantidade_estoque: number }[]) => {
    setShipmentProducts(products);
  };

  const handleRemoveProduct = (productId: number) => {
    setRemovedProductId(productId);
    setShipmentProducts((prevProducts) => 
        prevProducts.filter((product) => product.id_produto !== productId)
    );
  };

  const handleBatchSelection = (id_produto: number, id_lote: number, quantidade_retirada: number, isChecked: boolean) => {
    setBatchSelections(prevSelections => {
      const existingSelectionIndex = prevSelections.findIndex(selection => selection.id_produto === id_produto && selection.id_lote === id_lote);

      if (existingSelectionIndex > -1) {
        // If batch is already selected, update quantity
        const updatedSelections = [...prevSelections];
        updatedSelections[existingSelectionIndex].quantidade_retirada = quantidade_retirada;
        if (quantidade_retirada === 0) {
          // If quantity is 0, remove the selection
          updatedSelections.splice(existingSelectionIndex, 1);
        }

        setValue('produtos', updatedSelections)

        return updatedSelections;
      } else if (quantidade_retirada > 0) {
        // If the batch is not selected and quantity is greater than 0, add it to selections
        const newSelection = { id_produto, id_lote, quantidade_retirada };
        const newSelections = [...prevSelections, newSelection];

        // Set the new selections in the form
        setValue('produtos', newSelections); // Update the form with new selections

        return newSelections;
      }

      if (isChecked) {
        setCheckedBatches((prev) => [...prev, id_lote]);
      } else {
        setCheckedBatches((prev) => prev.filter((id) => id !== id_lote)); //CARALHO MANO QUE MERDA QUE NADA FUNCIONA NESSA BOSTA THE REACT DO CARALHO AÍ TEM Q FAZER ESSAS BOSTA
      }                                                                   //OLHA ISSO MANO IF > IF > IF > IF TUDO ISSO PRA MANDAR A PORRA DE UM FORMULARIO PQP MANO SE MATA QUEM
                                                                          //CRIOU ESSA PORRA. Se alguém souber como arrumar esse formulario seja bem vindo!
      return prevSelections; // No changes made
    });
  };

  const onSuccess = () => {
    reset();
    setSuccessMessage('Produto Cadastrado com Sucesso!');
    setResetKey(prev => prev + 1)
    setBatchSelections([])
    setShipmentProducts([])
    setValue('produtos', [])

    // Limpar a mensagem após 2 segundos
    setTimeout(() => {
      setSuccessMessage('');
  }, 2000);

    refetch();
  };

  const mutation = useCreateShipment(onSuccess);

  const onSubmit = (data: ShipmentSchema) => {
    const allProductsValid = shipmentProducts.every(product => 
      batchSelections.some(selection => selection.id_produto === product.id_produto && selection.quantidade_retirada > 0)
    );
  
    if (!allProductsValid) {
      setServerError('Há produtos sendo enviados sem lote!');
      return; // Prevent form submission
    }

    setServerError(null);
    setSuccessMessage(null);
    mutation.mutate(data);
  };

  const onError = (errors: any) => {
    console.error('Zod validation errors:', errors)
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className='shipping-form'
    >
      <h2>Saída de Produtos</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {serverError && <p className="error-message">{serverError}</p>}

      {/* Reason for Outgoing Product */}
      <h3>Motivo para a saída do produto</h3>
      <select {...register('motivo_saida')} defaultValue="" required>
        <option value="" disabled>Selecione um motivo</option>
        <option value="produto fora da validade">Produto fora da validade</option>
        <option value="produto com defeito">Produto com defeito</option>
        <option value="venda">Venda</option>
      </select>

      <ShipmentProducts onProductsSelected={handleProductsSelected} removedProductId={removedProductId} resetKey={resetKey}/>

      <h3>Produtos selecionados:</h3>
      {shipmentProducts.length === 0 ? (
        <p>Nenhum produto selecionado.</p>
      ) : (
        <ul>
          {shipmentProducts.map((product, index) => {
            const { data: batches = [], isLoading, isError } = batchResults[index] || {};

            return (
              <li key={product.id_produto}>
                <strong>{product.nome_produto}</strong> (ID: {product.id_produto}) - Quantidade disponível: {product.quantidade_estoque}
                <button style={{ marginTop: '15px', backgroundColor: '#dc3545'}}     onMouseOver={e => e.currentTarget.style.backgroundColor = '#c82333'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#dc3545'} type="button" onClick={() => handleRemoveProduct(product.id_produto)}>
                  Remover
                </button>
                <ul>
                  {isLoading ? (
                    <p>Loading batches...</p>
                  ) : isError ? (
                    <p>Error loading batches.</p>
                  ) : batches.length === 0 ? (
                    <p>No batches available for this product.</p>
                  ) : (
                    batches.map(batch => (
                      <li key={batch.id_lote}>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              const quantity = e.target.checked ? 0 : 0; // Default to 1 when checked
                              handleBatchSelection(product.id_produto, batch.id_lote, quantity, isChecked);
                            }}
                          />
                          ID do Lote: {batch.id_lote} - Disnonível: {batch.quantidadeDisponivel} unidade
                          <input
                            type="number"
                            min="1"
                            max={batch.quantidadeDisponivel}
                            placeholder="Qtd"
                            disabled={!checkedBatches.includes(batch.id_lote)}
                            onChange={(e) => {
                              const quantity = Number(e.target.value);
                              if (quantity > 0 && batch.id_lote) {
                                handleBatchSelection(product.id_produto, batch.id_lote, quantity, true);
                              } else {
                                handleBatchSelection(product.id_produto, batch.id_lote, 0, true); // Set quantity to 0 if invalid
                              }
                            }}
                          />
                        </label>
                      </li>
                    ))
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      )}

      <button style={{ marginTop: '20px' }} type="submit">Enviar Remessas</button>
    </form>
  );
};

export default ShipmentForm;
