/*
  Warnings:

  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - Added the required column `product_name` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `name`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `product_name` VARCHAR(191) NOT NULL;
