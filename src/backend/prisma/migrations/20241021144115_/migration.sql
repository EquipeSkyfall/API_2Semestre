-- AlterTable
ALTER TABLE `fornecedor` MODIFY `fornecedor_deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `lote` MODIFY `data_compra` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `produto` MODIFY `produto_deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `saida` MODIFY `data_venda` DATETIME(3) NOT NULL;
