-- AlterTable
ALTER TABLE `task` ADD COLUMN `finished_at` DATETIME(0) NULL,
    ADD COLUMN `started_at` DATETIME(0) NULL;
