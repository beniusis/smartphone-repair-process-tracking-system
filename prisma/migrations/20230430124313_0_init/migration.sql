-- CreateTable
CREATE TABLE `offer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `cost` FLOAT NULL,
    `status` CHAR(8) NULL,
    `fk_repair` INTEGER NOT NULL,

    INDEX `fk_repair`(`fk_repair`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `registered_at` DATETIME(0) NULL,
    `started_at` DATETIME(0) NULL,
    `finished_at` DATETIME(0) NULL,
    `estimated_time` TIME(0) NULL,
    `total_cost` FLOAT NULL,
    `status` CHAR(11) NULL,
    `rating` INTEGER NULL,
    `review` DATETIME(0) NULL,
    `fk_user_client` INTEGER NOT NULL,
    `fk_user_employee` INTEGER NOT NULL,

    INDEX `fk_user_client`(`fk_user_client`),
    INDEX `fk_user_employee`(`fk_user_employee`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_and_time` DATETIME(0) NULL,
    `fk_user` INTEGER NOT NULL,

    INDEX `fk_user`(`fk_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_hours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `opening_time` INTEGER NULL,
    `closing_time` INTEGER NULL,
    `interval` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `status` CHAR(11) NULL,
    `fk_repair` INTEGER NOT NULL,

    INDEX `fk_repair`(`fk_repair`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `surname` VARCHAR(255) NULL,
    `email_address` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `phone_number` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `role` CHAR(13) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `offer` ADD CONSTRAINT `offer_ibfk_1` FOREIGN KEY (`fk_repair`) REFERENCES `repair`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `repair` ADD CONSTRAINT `repair_ibfk_1` FOREIGN KEY (`fk_user_client`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `repair` ADD CONSTRAINT `repair_ibfk_2` FOREIGN KEY (`fk_user_employee`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`fk_repair`) REFERENCES `repair`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
