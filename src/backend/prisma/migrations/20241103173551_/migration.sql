-- CreateTable
CREATE TABLE `SystemLog` (
    `id_log` INTEGER NOT NULL AUTO_INCREMENT,
    `data_processo` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `action_type` VARCHAR(20) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `id_categoria` INTEGER NULL,
    `id_setor` INTEGER NULL,
    `id_produto` INTEGER NULL,
    `id_fornecedor` INTEGER NULL,
    `id_saida` INTEGER NULL,
    `id_entrada` INTEGER NULL,

    INDEX `idx_data_processo`(`data_processo`),
    INDEX `idx_id_user`(`id_user`),
    INDEX `idx_action_type`(`action_type`),
    INDEX `idx_related_ids`(`id_categoria`, `id_setor`, `id_produto`, `id_fornecedor`, `id_saida`, `id_entrada`),
    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SystemLog` ADD CONSTRAINT `SystemLog_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemLog` ADD CONSTRAINT `SystemLog_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `Categoria`(`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemLog` ADD CONSTRAINT `SystemLog_id_setor_fkey` FOREIGN KEY (`id_setor`) REFERENCES `Setor`(`id_setor`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemLog` ADD CONSTRAINT `SystemLog_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `Produto`(`id_produto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemLog` ADD CONSTRAINT `SystemLog_id_fornecedor_fkey` FOREIGN KEY (`id_fornecedor`) REFERENCES `Fornecedor`(`id_fornecedor`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemLog` ADD CONSTRAINT `SystemLog_id_saida_fkey` FOREIGN KEY (`id_saida`) REFERENCES `Saida`(`id_saida`) ON DELETE SET NULL ON UPDATE CASCADE;
