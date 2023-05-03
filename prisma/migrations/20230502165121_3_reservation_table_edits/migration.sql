/*
  Warnings:

  - You are about to alter the column `date` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE `reservation` MODIFY `date` VARCHAR(10) NULL,
    MODIFY `time` VARCHAR(5) NULL;
