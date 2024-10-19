import React, { useState, useEffect } from 'react';
import useGetProductBatches from '../../../Hooks/Shippments/useGetProductBatches';

interface ProductBatchesSelectionProps {
  productId: number;
  onSelectionChange: (selectedBatches: SelectedBatch[]) => void;
}

interface SelectedBatch {
  id_lote: number;
  quantidade_retirada: number;
}

const ProductBatchesSelection: React.FC<ProductBatchesSelectionProps> = ({
  productId,
  onSelectionChange,
}) => {
  const { data: batches = [], isLoading, isError } = useGetProductBatches(productId);
  const [selectedBatches, setSelectedBatches] = useState<SelectedBatch[]>([]);

  const handleCheckboxChange = (batchId: number, checked: boolean) => {
    setSelectedBatches((prev) =>
      checked
        ? [...prev, { id_lote: batchId, quantidade_retirada: 0 }]
        : prev.filter((batch) => batch.id_lote !== batchId)
    );
  };

  const handleQuantityChange = (batchId: number, quantity: number) => {
    setSelectedBatches((prev) =>
      prev.map((batch) =>
        batch.id_lote === batchId ? { ...batch, quantidade_retirada: quantity } : batch
      )
    );
  };

  useEffect(() => {
    onSelectionChange(selectedBatches);
  }, [selectedBatches, onSelectionChange]);

  if (isLoading) return <p>Loading batches...</p>;
  if (isError) return <p>Error loading batches.</p>;

  return (
    <div>
      <h3>Select Product Batches</h3>
      {batches.length === 0 ? (
        <p>No batches available for this product.</p>
      ) : (
        <ul>
          {batches.map((batch) => (
            <li key={batch.id_lote}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(batch.id_lote, e.target.checked)}
                />
                Batch {batch.id_lote} - Available: {batch.quantidadeDisponivel} units
                <input
                  type="number"
                  min={0}
                  max={batch.quantidadeDisponivel}
                  placeholder="Quantity"
                  disabled={
                    !selectedBatches.some((selected) => selected.id_lote === batch.id_lote)
                  }
                  onChange={(e) =>
                    handleQuantityChange(batch.id_lote, Number(e.target.value))
                  }
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductBatchesSelection;
