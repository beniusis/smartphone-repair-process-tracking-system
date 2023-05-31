-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `status` CHAR(11) NULL,
    `fk_repair` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`fk_repair`) REFERENCES `repair`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
