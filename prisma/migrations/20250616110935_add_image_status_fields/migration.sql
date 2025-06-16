-- AlterTable
ALTER TABLE `GeneratedImage` ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `promptIdea` VARCHAR(191) NULL,
    MODIFY `instructions` VARCHAR(191) NULL;
