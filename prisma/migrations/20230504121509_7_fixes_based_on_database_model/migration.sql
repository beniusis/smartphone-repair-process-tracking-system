/*
  Warnings:

  - You are about to alter the column `date` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Date`.
  - You are about to alter the column `time` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5)` to `Time`.
  - The `opening_time` column on the `reservation_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `closing_time` column on the `reservation_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `reservation` MODIFY `date` DATE NULL,
    MODIFY `time` TIME NULL;

-- AlterTable
ALTER TABLE `reservation_hours` DROP COLUMN `opening_time`,
    ADD COLUMN `opening_time` TIME NULL,
    DROP COLUMN `closing_time`,
    ADD COLUMN `closing_time` TIME NULL;
