/*
  Warnings:

  - Added the required column `unidade_medida` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produto` ADD COLUMN `unidade_medida` VARCHAR(2) NOT NULL;
