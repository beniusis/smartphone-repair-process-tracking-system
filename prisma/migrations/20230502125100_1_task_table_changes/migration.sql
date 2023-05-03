/*
  Warnings:

  - You are about to drop the column `date_and_time` on the `reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `date_and_time`,
    ADD COLUMN `date` DATE NULL,
    ADD COLUMN `time` TIME(0) NULL;
