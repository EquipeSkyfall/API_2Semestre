import React from 'react';
import './styles.css';  // Importando o arquivo de estilos
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/fontawesome-free/css/all.min.css';

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
    return (
        <div className="list-container">
            <ul className="list-items">
                {products.length > 0 ? (
                    products.map((product) => (
                        <li key={product.id_produto} className="list-item">
                            <div className="item-summary">
                                <span className="item-name">{product.nome_produto}</span>
                                <div className="item-details">
                                    <span className="item-category">{product.nome_categoria || 'Sem categoria'}</span>
                                    <span className="item-sector">{product.nome_setor || 'Sem setor'}</span>
                                    <span className="item-quantity">Qtd: {product.quantidade_estoque}</span>
                                </div>
                            </div>
                            <div className="item-actions">
                                <button onClick={() => onEdit(product)} className="edit-button">
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                                <button onClick={() => onDelete(product.id_produto)} className="delete-button">
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
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
