import React, { useState } from 'react';
import ProductList from '../ProductsList';
import SearchBar from '../ProdutosSearchBar';
import Modal from '../Modal';
import EditProduct from './EditProduct';
import useDeleteProduct from '../../Hooks/Products/deleteProductByIdHook';
import useUpdateProduct from '../../Hooks/Products/patchByIdProductHook';
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';
import './styles.css'

interface Product extends ProductSchema {
    id_produto: number;
    quantidade_estoque: number;
}

interface ProductsUpdateAndDeleteProps {
    products: Product[];
    onSearchTermChange: (term: string, categoryId: number | null, sectorId: number | null) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    refetch: () => void; // Passar a função de refazer consulta
}

const ProductsUpdateAndDelete: React.FC<ProductsUpdateAndDeleteProps> = ({
    products,
    onSearchTermChange,
    currentPage,
    setCurrentPage,
    totalPages,
    refetch,
}) => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedProduct: Product) => {
        try {
            await updateProductMutation.mutateAsync(updatedProduct);
            setIsModalOpen(false);
            refetch(); // Refazer consulta após atualização
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
    };
    
    const handleDelete = async (id_produto: number) => {
        if (window.confirm('Você tem certeza que deseja excluir este produto?')) {
            try {
                console.log(id_produto)
                await deleteProductMutation.mutateAsync(id_produto);
                refetch(); // Refazer consulta após exclusão
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            }
        }
    };

    return (
        <div className='flex flex-col items-center border'>
            <h2>Produtos</h2>

            {/* Barra de Pesquisa */}
            <SearchBar
                onSearchTermChange={onSearchTermChange}
            />

            {/* Lista de Produtos */}
            <ProductList
                products={products}
                onEdit={handleEdit}
                currentPage={currentPage}
                handlePageChange={setCurrentPage}
                totalPages={totalPages} // Passando totalPages para lógica de paginação
                onDelete={handleDelete}
                itemsPerPage={5}
            />

            {/* Modal para Edição do Produto */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingProduct && (
                    <EditProduct
                        product={editingProduct}
                        onUpdate={handleUpdate}
                        onClose={() => setIsModalOpen(false)}
                        refetch={refetch}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProductsUpdateAndDelete;
