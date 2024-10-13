-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `batch` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `quantity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `price` DOUBLE NOT NULL,
    `retail_price` DOUBLE NOT NULL,
    `stock_location` DOUBLE NOT NULL,
    `id_category` INTEGER NOT NULL,
    `id_sector` INTEGER NOT NULL,
    `url_image` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NULL,
    `height` DOUBLE NULL,
    `width` DOUBLE NULL,
    `updatedAT` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
