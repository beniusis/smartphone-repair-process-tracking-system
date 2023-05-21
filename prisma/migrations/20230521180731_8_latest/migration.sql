/*
  Warnings:

  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `task_ibfk_1`;

-- DropTable
DROP TABLE `task`;
