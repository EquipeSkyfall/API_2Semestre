/*
  Warnings:

  - You are about to alter the column `stock_location` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `stock_location` VARCHAR(191) NOT NULL;
