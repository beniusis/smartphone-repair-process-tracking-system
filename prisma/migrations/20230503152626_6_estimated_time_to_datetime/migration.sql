/*
  Warnings:

  - You are about to alter the column `estimated_time` on the `repair` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `DateTime(0)`.

*/
-- AlterTable
ALTER TABLE `repair` MODIFY `estimated_time` DATETIME(0) NULL;
