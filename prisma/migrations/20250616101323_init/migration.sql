-- CreateTable
CREATE TABLE `ImageRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `instructions` VARCHAR(191) NOT NULL,
    `prompt` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'waiting',
    `imageUrl` VARCHAR(191) NULL,
    `referenceUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
