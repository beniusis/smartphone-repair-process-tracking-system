-- AlterTable
ALTER TABLE `repair` MODIFY `registered_at` DATETIME(0) NULL,
    MODIFY `started_at` DATETIME(0) NULL,
    MODIFY `finished_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `reservation` MODIFY `date` VARCHAR(10) NULL,
    MODIFY `time` VARCHAR(5) NULL;
