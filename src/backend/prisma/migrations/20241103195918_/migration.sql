/*
  Warnings:

  - You are about to drop the column `id_entrada` on the `systemlog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `systemlog` DROP FOREIGN KEY `SystemLog_id_categoria_fkey`;

-- DropForeignKey
ALTER TABLE `systemlog` DROP FOREIGN KEY `SystemLog_id_fornecedor_fkey`;

-- DropForeignKey
ALTER TABLE `systemlog` DROP FOREIGN KEY `SystemLog_id_produto_fkey`;

-- DropForeignKey
ALTER TABLE `systemlog` DROP FOREIGN KEY `SystemLog_id_saida_fkey`;

-- DropForeignKey
ALTER TABLE `systemlog` DROP FOREIGN KEY `SystemLog_id_setor_fkey`;

-- DropForeignKey
ALTER TABLE `systemlog` DROP FOREIGN KEY `SystemLog_id_user_fkey`;

-- DropIndex
DROP INDEX `idx_related_ids` ON `systemlog`;

-- AlterTable
ALTER TABLE `systemlog` DROP COLUMN `id_entrada`,
    ADD COLUMN `id_affected_user` INTEGER NULL,
    ADD COLUMN `id_lote` INTEGER NULL;

-- CreateIndex
CREATE INDEX `idx_related_ids` ON `SystemLog`(`id_categoria`, `id_setor`, `id_produto`, `id_fornecedor`, `id_saida`, `id_lote`);
