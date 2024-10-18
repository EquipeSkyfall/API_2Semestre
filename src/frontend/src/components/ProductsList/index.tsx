import React, { useState } from 'react';
import './styles.css';  // Importando o arquivo de estilos
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';

interface ProductListing extends ProductSchema {
    id_produto: number;
    nome_categoria: string;
    nome_setor: string;
    quantidade_estoque: number;
}

interface ProductListProps {
    products: ProductListing[];
    onEdit: (product: ProductListing) => void;
    currentPage: number;
    handlePageChange: (newPage: number) => void;
    totalPages: number;
    itemsPerPage: number;
    onDelete: (id_produto: number) => void;
}

const ProductList: React.FC<ProductListProps> = React.memo(({
    products,
    onEdit,
    currentPage,
    handlePageChange,
    totalPages,
    itemsPerPage,
    onDelete,
}) => {
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const toggleExpand = (productId: number) => {
        setExpandedProductId(prev => (prev === productId ? null : productId));
    };

    return (
        <div className="product-list">
            <ul>
                {products.length > 0 ? (
                    products.map((product: ProductListing) => (
                        <li key={product.id_produto} className="product-item">
                            <span className="product-name" onClick={() => toggleExpand(product.id_produto)}>
                                {product.nome_produto}
                            </span><br />
                            <span className="product-amount">Quantidade: {product.quantidade_estoque}</span>
                            <button onClick={() => onEdit(product)} className="edit-btn">Edit</button>
                            <button onClick={() => onDelete(product.id_produto)} className="delete-btn">Delete</button>

                            {expandedProductId === product.id_produto && (
                                <div className="product-details">
                                    <p><strong>Category:</strong> {product.nome_categoria || 'Sem categoria'}</p>
                                    <p><strong>Sector:</strong> {product.nome_setor || 'Sem setor'}</p>
                                    <p><strong>Altura:</strong> {product.altura_produto}</p>
                                    <p><strong>Comprimento:</strong> {product.comprimento_produto}</p>
                                    <p><strong>Largura:</strong> {product.largura_produto}</p>
                                    <p><strong>Descrição:</strong> {product.descricao_produto}</p>
                                    <p><strong>Localização:</strong> {product.localizacao_estoque}</p>
                                    <p><strong>Marca:</strong> {product.marca_produto}</p>
                                    <p><strong>Modelo:</strong> {product.modelo_produto}</p>
                                    <p><strong>Peso:</strong> {product.peso_produto}{product.unidade_medida}</p>
                                    <p><strong>Preço Venda:</strong> {product.preco_venda}</p>
                                    <p><strong>Available Stock:</strong> {product.quantidade_estoque}</p>
                                    {/* Add more detailed fields as needed */}
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <li>No products found</li>
                )}
            </ul>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                >
                    Previous
                </button>
                {totalPages > 0 ? `Página ${currentPage} de ${totalPages}` : ''}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="pagination-btn"
                >
                    Next
                </button>
            </div>
        </div>
    );
});

export default ProductList;
