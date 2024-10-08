-- CreateTable
CREATE TABLE `Categoria` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_categoria` VARCHAR(100) NOT NULL,
    `descricao_categoria` VARCHAR(255) NULL,

    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setor` (
    `id_setor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_setor` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_setor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id_produto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_produto` VARCHAR(255) NOT NULL,
    `descricao_produto` VARCHAR(255) NULL,
    `marca_produto` VARCHAR(255) NULL,
    `modelo_produto` VARCHAR(255) NULL,
    `preco_venda` DECIMAL(10, 2) NOT NULL,
    `altura_produto` DECIMAL(10, 2) NOT NULL,
    `largura_produto` DECIMAL(10, 2) NOT NULL,
    `comprimento_produto` DECIMAL(10, 2) NOT NULL,
    `localizacao_estoque` VARCHAR(255) NULL,
    `permalink_imagem` VARCHAR(255) NULL,
    `peso_produto` DECIMAL(10, 2) NOT NULL,
    `produto_deletedAt` DATE NULL,
    `id_categoria` INTEGER NULL,
    `id_setor` INTEGER NULL,

    INDEX `idx_nome_produto`(`nome_produto`),
    INDEX `idx_id_categoria`(`id_categoria`),
    INDEX `idx_id_setor`(`id_setor`),
    INDEX `idx_produto_deletedAt`(`produto_deletedAt`),
    PRIMARY KEY (`id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fornecedor` (
    `id_fornecedor` INTEGER NOT NULL AUTO_INCREMENT,
    `cnpj_fornecedor` VARCHAR(14) NOT NULL,
    `razao_social` VARCHAR(255) NOT NULL,
    `nome_fantasia` VARCHAR(255) NULL,
    `endereco_fornecedor` VARCHAR(255) NULL,
    `cidade` VARCHAR(100) NOT NULL,
    `estado` CHAR(2) NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `fornecedor_deletedAt` DATE NULL,

    UNIQUE INDEX `Fornecedor_cnpj_fornecedor_key`(`cnpj_fornecedor`),
    INDEX `idx_razao_social`(`razao_social`),
    INDEX `idx_cidade`(`cidade`),
    INDEX `idx_estado`(`estado`),
    INDEX `idx_fornecedor_deletedAt`(`fornecedor_deletedAt`),
    PRIMARY KEY (`id_fornecedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProdutosFornecedor` (
    `id_fornecedor` INTEGER NOT NULL,
    `id_produto` INTEGER NOT NULL,
    `preco_custo` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_fornecedor`, `id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lote` (
    `id_lote` INTEGER NOT NULL AUTO_INCREMENT,
    `id_fornecedor` INTEGER NOT NULL,
    `data_compra` DATE NOT NULL,

    PRIMARY KEY (`id_lote`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoteProdutos` (
    `id_lote` INTEGER NOT NULL,
    `id_produto` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `validade_produto` DATE NULL,

    PRIMARY KEY (`id_lote`, `id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Saida` (
    `id_saida` INTEGER NOT NULL AUTO_INCREMENT,
    `data_venda` DATE NOT NULL,
    `motivo_saida` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_saida`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaidaProduto` (
    `id_saida` INTEGER NOT NULL,
    `id_produto` INTEGER NOT NULL,
    `id_lote` INTEGER NOT NULL,
    `quantidade_retirada` INTEGER NOT NULL,

    PRIMARY KEY (`id_saida`, `id_produto`, `id_lote`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAT` DATETIME(3) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `Categoria`(`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_id_setor_fkey` FOREIGN KEY (`id_setor`) REFERENCES `Setor`(`id_setor`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdutosFornecedor` ADD CONSTRAINT `ProdutosFornecedor_id_fornecedor_fkey` FOREIGN KEY (`id_fornecedor`) REFERENCES `Fornecedor`(`id_fornecedor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdutosFornecedor` ADD CONSTRAINT `ProdutosFornecedor_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `Produto`(`id_produto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lote` ADD CONSTRAINT `Lote_id_fornecedor_fkey` FOREIGN KEY (`id_fornecedor`) REFERENCES `Fornecedor`(`id_fornecedor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoteProdutos` ADD CONSTRAINT `LoteProdutos_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `Lote`(`id_lote`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoteProdutos` ADD CONSTRAINT `LoteProdutos_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `Produto`(`id_produto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaidaProduto` ADD CONSTRAINT `SaidaProduto_id_saida_fkey` FOREIGN KEY (`id_saida`) REFERENCES `Saida`(`id_saida`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaidaProduto` ADD CONSTRAINT `SaidaProduto_id_produto_id_lote_fkey` FOREIGN KEY (`id_produto`, `id_lote`) REFERENCES `LoteProdutos`(`id_produto`, `id_lote`) ON DELETE RESTRICT ON UPDATE CASCADE;
