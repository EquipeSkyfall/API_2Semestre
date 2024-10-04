/*
  Warnings:

  - You are about to drop the column `preco_custo` on the `produto` table. All the data in the column will be lost.
  - Added the required column `preco_custo` to the `ProdutosFornecedor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivo_saida` to the `Saida` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produto` DROP COLUMN `preco_custo`;

-- AlterTable
ALTER TABLE `produtosfornecedor` ADD COLUMN `preco_custo` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `saida` ADD COLUMN `motivo_saida` VARCHAR(100) NOT NULL;
