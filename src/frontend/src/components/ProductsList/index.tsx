import React, { useState } from 'react';
import './productslist.css'
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

const ProductList: React.FC<ProductListProps> = ({
    products,
    onEdit,
    currentPage,
    handlePageChange,
    totalPages,
    itemsPerPage,
    onDelete,
}) => {
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const [closing, setClosing] = useState(false);

    const toggleExpand = (productId: number) => {
        if (expandedProductId === productId) {
            setClosing(true);
            setTimeout(() => {
                setExpandedProductId(null);
                setClosing(false);
            }, 500);
        } else {
            setExpandedProductId(productId);
        }
    };

    return (
        <div className="list-container">
            <div className="product-list">
                <table className="info-table">
                    <thead>
                        <tr>
                            <th>Nome do Produto</th>
                            <th>Fabricante</th>
                            <th>ID</th>
                            <th>Qtd. Estoque</th>
                            <th>Data (Entrada)</th>
                            <th>Data (Saída)</th>
                            <th>Preço</th>
                            <th>Atualizado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id_produto}>
                                    <td onClick={() => toggleExpand(product.id_produto)} className="item-name">
                                        {product.nome_produto}
                                    </td>
                                    <td>{product.marca_produto}</td>
                                    <td>{product.id_produto}</td>
                                    <td>{product.total_estoque}</td>
                                    <td>2024-01-01</td>
                                    <td>2024-01-10</td>
                                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda)}</td>
                                    <td>2024-10-20</td>

                                    <td className="item-actions">
                                        <button onClick={() => onEdit(product)} className="edit-button">
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </button>
                                        <button onClick={() => onDelete(product.id_produto)} className="delete-button">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="no-products">Nenhum produto encontrado</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="controles-pagina">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Voltar
                    </button>
                    {totalPages > 0 ? `Página ${currentPage} de ${totalPages}` : ''}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="pagination-button"
                    >
                        Avançar
                    </button>
                </div>
            </div>

            {expandedProductId !== null && (
                <div className={`product-details-container ${closing ? 'closing' : ''}`} style={{ animation: closing ? 'fadeOutZoom 0.4s ease forwards' : 'fadeInZoom 0.4s ease forwards' }}>
                    {products
                        .filter((product) => product.id_produto === expandedProductId)
                        .map((product) => (
                            <div key={product.id_produto} className="product-details">
                                <h1 className='titulo'>Detalhes</h1>
                                <p><strong>Categoria:</strong> {product.categoria?.nome_categoria || 'Sem categoria'}</p>
                                <p><strong>Setor:</strong> {product.setor?.nome_setor || 'Sem setor'}</p>
                                <p><strong>Altura:</strong> {product.altura_produto} cm</p>
                                <p><strong>Comprimento:</strong> {product.comprimento_produto} cm</p>
                                <p><strong>Largura:</strong> {product.largura_produto} cm</p>
                                <p><strong>Descrição:</strong> {product.descricao_produto}</p>
                                <p><strong>Localização:</strong> {product.localizacao_estoque}</p>
                                <p><strong>Marca:</strong> {product.marca_produto}</p>
                                <p><strong>Modelo:</strong> {product.modelo_produto}</p>
                                <p><strong>Peso:</strong> {product.peso_produto} {product.unidade_medida}</p>
                                <p><strong>Preço Venda:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda)}</p>
                                <p><strong>Estoque Disponível:</strong> {product.total_estoque}</p>
                                <button>Ver Fornecedores</button>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
