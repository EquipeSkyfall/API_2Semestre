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
    console.log(quantity)
    batches.map(batch => {
      if (batch.quantidadeDisponivel < quantity) {
        handleBatchSelection(id_produto, batch.id_lote, batch.quantidadeDisponivel)
        quantity -= batch.quantidadeDisponivel
      } else if (quantity === 0) {
        handleBatchSelection(id_produto, batch.id_lote, 0)
      } else {
        handleBatchSelection(id_produto, batch.id_lote, quantity)
        quantity -= quantity
      }
    })
  }

  const handleBatchSelection = (id_produto, id_lote, quantidade_retirada) => {
    setBatchSelections(prevSelections => {
      const existingSelectionIndex = prevSelections.findIndex(
        selection => selection.id_produto === id_produto && selection.id_lote === id_lote
      );
      const updatedSelections = [...prevSelections];

      // If the batch is already selected, update quantity
      if (existingSelectionIndex > -1) {
        updatedSelections[existingSelectionIndex].quantidade_retirada = quantidade_retirada;

        if (quantidade_retirada === 0) {
          // If quantity is 0, remove the selection and uncheck
          updatedSelections.splice(existingSelectionIndex, 1);
          setCheckedBatches(prev => prev.filter(
            batch => !(batch.id_produto === id_produto && batch.id_lote === id_lote)
          ));
        }
      } else if (quantidade_retirada > 0) {
        // If the batch is not selected and quantity is greater than 0, add it to selections
        const newSelection = { id_produto, id_lote, quantidade_retirada };
        updatedSelections.push(newSelection);
        setCheckedBatches(prev => [...prev, { id_produto, id_lote }]); // Check the batch
      }

      const totalQuantity = updatedSelections
        .filter(selection => selection.id_produto === id_produto)
        .reduce((sum, selection) => sum + selection.quantidade_retirada, 0);

      setProductQuantities(prev => ({ ...prev, [id_produto]: totalQuantity }));

      // Update the form value with the new selections
      setValue('produtos', updatedSelections);

      return updatedSelections; // Return the updated selections
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
      {/* <h2 className='color_conf'>Saída de Produtos</h2> */}

      {successMessage && <p className="success-message">{successMessage}</p>}
      {serverError && <p className="error-message">{serverError}</p>}

      {/* Reason for Outgoing Product */}
      <h2 className='align_conf'>Motivo para a saída do produto</h2>
      <select {...register('motivo_saida')} defaultValue="" required>
        <option value="" disabled>Selecione um motivo</option>
        <option value="Produto Fora da Validade">Produto fora da validade</option>
        <option value="Produto Com Defeito">Produto com defeito</option>
        <option value="Venda">Venda</option>
      </select>

      <div
      
      className="formContainer"   

      >
      <div className="insertProducts">
      <ShipmentProducts onProductsSelected={handleProductsSelected} removedProductId={removedProductId} resetKey={resetKey} />
      </div>

      <div className="dropProducts" >
      <h2 className='align_conf'>Produtos selecionados:</h2>
      {shipmentProducts.length === 0 ? (
        <p>Nenhum produto selecionado.</p>
      ) : (
        <ul>
          {shipmentProducts.map((product, index) => {
            const { data: batches = [], isLoading, isError } = batchResults[index] || {};
            const totalSelectedQuantity = productQuantities[product.id_produto] || 0;

            return (
              <li className='dimension_conf Batch-Products' key={product.id_produto}>
                  <strong onClick={() => toggleExpand(product.id_produto)}>
                    {product.nome_produto}: ID: {product.id_produto} - Quantidade disponível: {product.total_estoque}
                  </strong>
                  <div className='form-field'>
                    Quantidade que irá sair:
                    <input
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
                {expandedProductId === product.id_produto && (
                  <ul>
                    {isLoading ? (
                      <p>Loading batches...</p>
                    ) : isError ? (
                      <p>Error loading batches.</p>
                    ) : batches.length === 0 ? (
                      <p>No batches available for this product.</p>
                    ) : (
                      batches.map(batch => {
                        const isChecked = checkedBatches.some(
                          checkedBatch => checkedBatch.id_produto === product.id_produto && checkedBatch.id_lote === batch.id_lote
                        );
                        const currentQuantity = batchSelections.find(selection => selection.id_produto === product.id_produto && selection.id_lote === batch.id_lote)?.quantidade_retirada || 0;

                        return (
                          <li key={batch.id_lote}>
                            <label>
                              <input
                                type="checkbox"
                                className="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  const quantity = isChecked ? 1 : 0; // Set quantity to 1 when checked, 0 when unchecked

                                  handleBatchSelection(product.id_produto, batch.id_lote, quantity);

                                  // If checked, ensure the quantity input reflects this
                                  if (isChecked) {
                                    setCheckedBatches(prev => {
                                      const newBatch = { id_produto: product.id_produto, id_lote: batch.id_lote };
                                      return [...new Set([...prev, newBatch])]; // Ensure the batch (id_produto + id_lote) is added without duplicates
                                    });
                                  } else {
                                    setCheckedBatches(prev =>
                                      prev.filter(b => !(b.id_produto === product.id_produto && b.id_lote === batch.id_lote)) // Remove the batch by matching both id_produto and id_lote
                                    );
                                  }
                                }}
                              />
                              ID do Lote: {batch.id_lote} - Disponível: {batch.quantidadeDisponivel} unidade
                              <input
                                type="number"
                                min="0"
                                max={batch.quantidadeDisponivel}
                                placeholder="Qtd"
                                value={currentQuantity} // Bind the input value to the current quantity
                                onChange={(e) => {
                                  const quantity = Number(e.target.value);
                                  handleBatchSelection(product.id_produto, batch.id_lote, quantity);

                                  // Automatically check the checkbox if quantity is greater than 0
                                  if (quantity > 0) {
                                    setCheckedBatches(prev => {
                                      const newBatch = { id_produto: product.id_produto, id_lote: batch.id_lote };
                                      return [...new Set([...prev, newBatch])]; // Ensure the batch (id_produto + id_lote) is added without duplicates
                                    });
                                  } else {
                                    setCheckedBatches(prev =>
                                      prev.filter(b => !(b.id_produto === product.id_produto && b.id_lote === batch.id_lote))
                                    );
                                  }
                                }}
                              />
                            </label>
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}

                <button
                  onClick={() => handleRemoveProduct(product)}
                  className="button-remove-products"
                >
                <FontAwesomeIcon icon={faTrash} />
                </button>
                
              </li>
            );
          })}
        </ul>
      )}
      </div>
      </div>

      <button style={{ marginTop: '20px' }} type="submit">Enviar Remessas</button>
    </form>
  );
};

export default ShipmentForm;
