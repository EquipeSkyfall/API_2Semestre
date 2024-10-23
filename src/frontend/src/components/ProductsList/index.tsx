import React, { useState } from 'react';
import './styles.css';  // Importando o arquivo de estilos
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/fontawesome-free/css/all.min.css';

interface ProductListing extends ProductSchema {
    id_produto: number;
    categoria: {
        nome_categoria: string;
    };
    setor: {
        nome_setor: string;
    };
    total_estoque: number;
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
        <div className="list-container">
            <ul className="list-items">
                {products.length > 0 ? (
                    products.map((product) => (
                        <li key={product.id_produto} className="list-item">
                            <div className="item-summary">
                                <span className="item-name" onClick={() => toggleExpand(product.id_produto)}>
                                    {product.nome_produto}
                                </span>
                                <div className="item-actions">
                                    <button onClick={() => onEdit(product)} className="edit-button">
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>
                                    <button onClick={() => onDelete(product.id_produto)} className="delete-button">
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </div>
                            </div>
                            {expandedProductId === product.id_produto && (
                                <div className="product-details">
                                    <p><strong>Category:</strong> {product.categoria?.nome_categoria || 'Sem categoria'}</p>
                                    <p><strong>Sector:</strong> {product.setor?.nome_setor || 'Sem setor'}</p>
                                    <p><strong>Altura:</strong> {product.altura_produto} cm</p>
                                    <p><strong>Comprimento:</strong> {product.comprimento_produto} cm</p>
                                    <p><strong>Largura:</strong> {product.largura_produto} cm</p>
                                    <p><strong>Descrição:</strong> {product.descricao_produto}</p>
                                    <p><strong>Localização:</strong> {product.localizacao_estoque}</p>
                                    <p><strong>Marca:</strong> {product.marca_produto}</p>
                                    <p><strong>Modelo:</strong> {product.modelo_produto}</p>
                                    <p><strong>Peso:</strong> {product.peso_produto}{product.unidade_medida}</p>
                                    <p><strong>Preço Venda:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda)}</p>
                                    <p><strong>Available Stock:</strong> {product.total_estoque}</p>
                                    {/* Add more detailed fields as needed */}
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="no-products">Nenhum produto encontrado</li>
                )}
            </ul>

            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Anterior
                </button>
                {totalPages > 0 ? `Página ${currentPage} de ${totalPages}` : ''}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="pagination-button"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
});


export default ProductList;
