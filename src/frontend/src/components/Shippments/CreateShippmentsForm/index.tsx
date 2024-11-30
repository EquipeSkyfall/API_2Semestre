import React, { useState, FormEvent } from 'react';
import useGetProductBatches from '../../../Hooks/Shippments/useGetProductBatches';
import ShipmentProducts from '../ShipmentProducts';
import { ShipmentProductSchema, shipmentSchema, ShipmentSchema } from './CreateShipmentSchema/shipmentSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateShipment from '../../../Hooks/Shippments/useCreateShipment ';
import './styles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface ProductInputValue {
  id_produto: number;
  valor: number;
}

interface ProductFormProps {
  refetch: () => void;
}

const ShipmentForm: React.FC<ProductFormProps> = ({ refetch }) => {
  const [shipmentProducts, setShipmentProducts] = useState<{ id_produto: number, nome_produto: string, total_estoque: number }[]>([]);
  const [batchSelections, setBatchSelections] = useState<ShipmentProductSchema[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [removedProductId, setRemovedProductId] = useState<number | null>(null);
  const batchIds = shipmentProducts.map(product => product.id_produto);
  const batchResults = useGetProductBatches(batchIds); // Use the selected product IDs for batches
  const [resetKey, setResetKey] = useState<number>(0);
  const [checkedBatches, setCheckedBatches] = useState<{ id_produto: number, id_lote: number }[]>([]);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
  const toggleExpand = (productId: number) => {
    setExpandedProductId(prev => (prev === productId ? null : productId));
  };

  const methods = useForm<ShipmentSchema>({
    resolver: zodResolver(shipmentSchema),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, setValue } = methods

  // Handle the selected products from the child component
  const handleProductsSelected = (products: { id_produto: number; nome_produto: string; total_estoque: number }[]) => {
    setShipmentProducts(products);
  };

  const handleRemoveProduct = (productId: number) => {
    setRemovedProductId(productId);
    setShipmentProducts((prevProducts) =>
      prevProducts.filter((product) => product.id_produto !== productId)
    );
  };

  const fillBatches = (id_produto, batches, quantity) => {
    batches.map(batch => {
      if (batch.quantidadeDisponivel < quantity) {
        handleBatchSelection(id_produto, batch.id_lote, batch.quantidadeDisponivel);
        quantity -= batch.quantidadeDisponivel;
      } else if (quantity === 0) {
        handleBatchSelection(id_produto, batch.id_lote, 0);
      } else {
        handleBatchSelection(id_produto, batch.id_lote, quantity);
        quantity -= quantity; // Ajuste para garantir que a quantidade seja zerada corretamente
      }
    });
  };

  const handleBatchSelection = (id_produto, id_lote, quantidade_retirada) => {
    setBatchSelections(prevSelections => {
      const existingSelectionIndex = prevSelections.findIndex(
        selection => selection.id_produto === id_produto && selection.id_lote === id_lote
      );
      const updatedSelections = [...prevSelections];

      if (existingSelectionIndex > -1) {
        updatedSelections[existingSelectionIndex].quantidade_retirada = quantidade_retirada;

        if (quantidade_retirada === 0) {
          updatedSelections.splice(existingSelectionIndex, 1);
          setCheckedBatches(prev => prev.filter(
            batch => !(batch.id_produto === id_produto && batch.id_lote === id_lote)
          ));
        }
      } else if (quantidade_retirada > 0) {
        const newSelection = { id_produto, id_lote, quantidade_retirada };
        updatedSelections.push(newSelection);
        setCheckedBatches(prev => [...prev, { id_produto, id_lote }]);
      }

      const totalQuantity = updatedSelections
        .filter(selection => selection.id_produto === id_produto)
        .reduce((sum, selection) => sum + selection.quantidade_retirada, 0);

      setProductQuantities(prev => ({ ...prev, [id_produto]: totalQuantity }));
      setValue('produtos', updatedSelections);

      return updatedSelections;
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
      style={{ paddingBottom: '20px' }}
    >
      {/* <h2 className='color_conf'>Saída de Produtos</h2> */}

      {/*{successMessage && <p className="success-message">{successMessage}</p>} Removi dessa parte e coloquei no final da pagina */}
      {serverError && <p className="error-message">{serverError}</p>}

      {/* Reason for Outgoing Product */}
      <h2 className="align_conf text-align text-cyan-500 font-['Afacad_Flux']">Motivo para a saída do produto</h2>
      <select {...register('motivo_saida')} defaultValue="" className='text-gray-400' required>
        <option value="" disabled>Selecione um motivo</option>
        <option value="Produto Fora da Validade">Produto fora da validade</option>
        <option value="Produto Com Defeito">Produto com defeito</option>
        <option value="Venda">Venda</option>
      </select>

      <div className="flex-dimension">
        <div className="insertProducts">
          <ShipmentProducts onProductsSelected={handleProductsSelected} removedProductId={removedProductId} resetKey={resetKey} />
        </div>

        <div className="dropProducts div-position" >
          <h2 className="align_conf text-cyan-600 mb-5">Produtos selecionados:</h2>
          {shipmentProducts.length === 0 ? (
            <p>Nenhum produto selecionado.</p>
          ) : (
            <ul className="container !rounded"
              style={{ border: '1px solid #ccc', padding: '20px' }}
            >

              <li className='row' >
                <span>Produto</span>
                <span>Quantidade Disponível</span>
                <span>Quantidade que irá sair</span>
                <span></span>
              </li>

              {shipmentProducts.map((product, index) => {
                const { data: batches = [], isLoading, isError } = batchResults[index] || {};
                const totalSelectedQuantity = productQuantities[product.id_produto] || 0;

                return (
                  <li className='row' key={product.id_produto}>
                    <strong className='tex-center hover:text-cyan-600 transition-colors duration-300' onClick={() => toggleExpand(product.id_produto)}>
                      {product.nome_produto} - ID: {product.id_produto}
                    </strong>
                    <strong className='text-center hover:text-cyan-600 transition-colors duration-300' onClick={() => toggleExpand(product.id_produto)}>
                      {product.total_estoque}
                    </strong>

                    <div className='form-field -mt-2'>
                      {/* Quantidade que irá sair: */}
                      <input

                        style={{
                          padding: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          maxWidth: "80px",
                        }}

                        type='number'
                        min="1"
                        max={product.total_estoque}
                        placeholder="Qtd"
                        value={totalSelectedQuantity}
                        onChange={(e) => {
                          const quantity = Number(e.target.value);
                          fillBatches(product.id_produto, batches, quantity)
                        }}
                      />
                    </div>
                   {/* {expandedProductId === product.id_produto && (
                      <ul className='check-unity-align'>
                        {isLoading ? (
                          <p>Loading batches...</p>
                        ) : isError ? (
                          <p>Error loading batches.</p>
                        ) : batches.length === 0 ? (
                          <p>No batches available for this product.</p>
                        ) : (
                          *batches.map(batch => {
                            const isChecked = batchSelections.some(
                              selection => selection.id_produto === product.id_produto && selection.id_lote === batch.id_lote
                            );
                            const currentQuantity = batchSelections.find(
                              selection => selection.id_produto === product.id_produto && selection.id_lote === batch.id_lote
                            )?.quantidade_retirada || 0;

                            return (
                              <div key={batch.id_lote} className="flex -mt-20 items-center border-b border-gray-200">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const quantity = e.target.checked ? 1 : 0;
                                      handleBatchSelection(product.id_produto, batch.id_lote, quantity);
                                    }}
                                    className="form-checkbox h-4 w-4 text-cyan-500"
                                  />
                                  <span className="text-sm text-gray-700">Lote ID: {batch.id_lote}</span>
                                </div>
                                <span className='text-gray-700 p-2'>|</span>
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-500">Disponível: {batch.quantidadeDisponivel}</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={batch.quantidadeDisponivel}
                                    value={currentQuantity}
                                    onChange={(e) => handleBatchSelection(product.id_produto, batch.id_lote, Number(e.target.value))}
                                    className="w-16 p-1 border rounded text-center text-sm"
                                  />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </ul>
                    )}
                    */} 
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id_produto)}
                      className="flex items-center justify-center w-9 h-9 !bg-red-600 text-white hover:!bg-red-800 rounded-full focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <button type="submit" className='button-send-remessas !rounded-md'>Enviar Remessas</button>
          {successMessage && <p className="success-message">{successMessage}</p>}

        </div>
      </div>


    </form>
  );
};

export default ShipmentForm;
