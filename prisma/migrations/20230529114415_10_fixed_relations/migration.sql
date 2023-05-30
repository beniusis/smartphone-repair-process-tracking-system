-- AddForeignKey
ALTER TABLE `offer` ADD CONSTRAINT `offer_ibfk_1` FOREIGN KEY (`fk_repair`) REFERENCES `repair`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `repair` ADD CONSTRAINT `repair_ibfk_1` FOREIGN KEY (`fk_user_client`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `repair` ADD CONSTRAINT `repair_ibfk_2` FOREIGN KEY (`fk_user_employee`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
