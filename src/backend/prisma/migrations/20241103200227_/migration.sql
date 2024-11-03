-- DropIndex
DROP INDEX `SystemLog_id_fornecedor_fkey` ON `systemlog`;

-- DropIndex
DROP INDEX `SystemLog_id_produto_fkey` ON `systemlog`;

-- DropIndex
DROP INDEX `SystemLog_id_saida_fkey` ON `systemlog`;

-- DropIndex
DROP INDEX `SystemLog_id_setor_fkey` ON `systemlog`;

-- AddForeignKey
ALTER TABLE `SystemLog` ADD CONSTRAINT `SystemLog_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
