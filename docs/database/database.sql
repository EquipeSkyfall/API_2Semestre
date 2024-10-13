CREATE DATABASE estoque;
USE estoque;

CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nome_categoria VARCHAR(100),
    descricao_categoria VARCHAR(255)
);

CREATE TABLE setores (
    id_setor INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nome_setor VARCHAR(100)
);

CREATE TABLE produtos (
    id_produto INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nome_produto VARCHAR(255),
    descricao_produto VARCHAR(255),
    marca_produto VARCHAR(255),
    modelo_produto VARCHAR(255),
    preco_custo DECIMAL(10,2),
    preco_venda DECIMAL(10,2),
    altura_produto DECIMAL(10,2),
    largura_produto DECIMAL(10,2),
    comprimento_produto DECIMAL(10,2),
    unidade_medida CHAR(2),
    localizacao_estoque VARCHAR(255),
    permalink_imagem VARCHAR(255),
    peso_produto DECIMAL(10,2),
    deletedAt DATE,
    id_categoria INT NULL,
    id_setor INT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    FOREIGN KEY (id_setor) REFERENCES setores(id_setor) ON DELETE SET NULL
);

CREATE TABLE fornecedores (
    id_fornecedor INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    cnpj_fornecedor VARCHAR(14) UNIQUE NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    endereco_fornecedor VARCHAR(255),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(9)
);

CREATE TABLE produtos_fornecedor (
    id_fornecedor INT NOT NULL,
    id_produto INT KEY NOT NULL,
    PRIMARY KEY (id_fornecedor, id_produto),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor),
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

CREATE TABLE lote (
    id_lote INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_fornecedor INT NOT NULL,
    data_compra DATE NOT NULL,
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor)
);

CREATE TABLE lote_produtos (
    id_lote INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    validade_produto DATE,
    PRIMARY KEY (id_lote, id_produto),
    FOREIGN KEY (id_lote) REFERENCES lote(id_lote),
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

CREATE TABLE saida (
    id_saida INT PRIMARY KEY AUTO_INCREMENT NOT NULL
    data_venda DATE NOT NULL
);

CREATE TABLE saida_produto (
    id_saida INT NOT NULL,
    id_produto INT NOT NULL,
    id_lote INT NOT NULL,
    quantidade_retirada INT NOT NULL,
    PRIMARY KEY (id_saida, id_produto, id_lote),
    FOREIGN KEY (id_saida) REFERENCES saida(id_saida),
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto),
    FOREIGN KEY (id_lote) REFERENCES lote(id_lote)
)

CREATE INDEX idx_nome_produto ON produtos(nome_produto);
CREATE INDEX idx_id_categoria ON produtos(id_categoria);
CREATE INDEX idx_id_setor ON produtos(id_setor);
CREATE INDEX idx_deletedAt ON produtos(deletedAt);