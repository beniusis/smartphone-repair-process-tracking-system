/*
  Warnings:

  - You are about to alter the column `date` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Date`.
  - You are about to alter the column `time` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5)` to `Time`.

*/
-- AlterTable
ALTER TABLE `repair` MODIFY `registered_at` DATE NULL,
    MODIFY `started_at` DATE NULL,
    MODIFY `finished_at` DATE NULL,
    MODIFY `review` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `reservation` MODIFY `date` DATE NULL,
    MODIFY `time` TIME NULL;
