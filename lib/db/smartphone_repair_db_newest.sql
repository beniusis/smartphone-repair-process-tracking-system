-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2023 at 02:33 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartphone_repair_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `offer`
--

CREATE TABLE `offer` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost` float DEFAULT NULL,
  `status` char(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_repair` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offer`
--

INSERT INTO `offer` (`id`, `title`, `description`, `cost`, `status`, `fk_repair`) VALUES
(7, 'Apsauginio stikliuko uždėjimas', 'Papildomai stiklo apsaugai nuo įvairių dūžių, įbrėžimų galime uždėti apsauginį stikliuką. Ar to norėtumėte?', 9.99, 'declined', 12),
(8, 'Apsauginio dėkliuko uždėjimas', 'Ar norėtumėtė, kad uždėtumė papildomą apsauginį dėkliuką telefono nugarinės dalies apsaugai?', 15.99, 'accepted', 13),
(14, 'TOUCH ID mygtuko keitimas', 'Neveikiantis TOUCH ID mygtukas, kurį galime prie to pačio irgi pakeisti. Ar to norėtumėte?', 50, 'proposed', 20);

-- --------------------------------------------------------

--
-- Table structure for table `repair`
--

CREATE TABLE `repair` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registered_at` datetime DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `finished_at` datetime DEFAULT NULL,
  `estimated_time` datetime DEFAULT NULL,
  `total_cost` float DEFAULT NULL,
  `status` char(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `review` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_user_client` int(11) NOT NULL,
  `fk_user_employee` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `repair`
--

INSERT INTO `repair` (`id`, `title`, `registered_at`, `started_at`, `finished_at`, `estimated_time`, `total_cost`, `status`, `rating`, `review`, `fk_user_client`, `fk_user_employee`) VALUES
(11, 'Baterijos keitimas', '2023-05-29 12:09:00', NULL, NULL, NULL, 39.99, 'registered', NULL, NULL, 7, 6),
(12, 'Vidinio stiklo keitimas', '2023-05-29 12:25:00', '2023-05-30 08:10:00', '2023-05-30 10:33:00', '2023-05-30 10:00:00', 99.99, 'finished', NULL, NULL, 8, 6),
(13, 'iPhone nugarinės dalies keitimas', '2023-05-29 12:35:00', '2023-05-29 12:51:00', '2023-05-30 08:01:00', '2023-05-30 08:00:00', 99.99, 'finished', 10, 'Kokybiškas ir greitai atliktas remontas!', 9, 6),
(15, 'Galinės kameros keitimas', '2023-05-30 06:29:00', '2023-05-30 07:01:00', '2023-05-30 07:54:00', '2023-05-30 08:00:00', 50, 'finished', NULL, NULL, 7, 6),
(20, 'Įjungimo ir šoninių garso mygtukų jungtys', '2023-05-31 06:04:00', '2023-05-31 07:39:00', NULL, '2023-05-31 10:15:00', 30, 'in_progress', NULL, NULL, 8, 10),
(21, 'iPhone 12 Pro neoriginalaus LCD ekrano keitimas', '2023-05-30 07:22:00', NULL, NULL, NULL, 150, 'registered', NULL, NULL, 11, 10);

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `fk_user` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservation_hours`
--

CREATE TABLE `reservation_hours` (
  `id` int(11) NOT NULL,
  `interval` int(11) DEFAULT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reservation_hours`
--

INSERT INTO `reservation_hours` (`id`, `interval`, `opening_time`, `closing_time`) VALUES
(1, 10, '08:00:00', '17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` char(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_repair` int(11) NOT NULL,
  `finished_at` datetime DEFAULT NULL,
  `started_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `title`, `description`, `status`, `fk_repair`, `finished_at`, `started_at`) VALUES
(5, 'Įjungimo mygtuko pakeitimas', '-', 'in_progress', 20, NULL, '2023-05-31 07:40:00'),
(6, 'Garso mygtukų pakeitimas', '-', 'not_started', 20, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` char(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `surname`, `email_address`, `password`, `phone_number`, `address`, `role`) VALUES
(5, 'Jonas', 'Jonaitis', 'admin@maildrop.cc', '$2b$10$yB6jXZTSZ0V7knJpaIkEt.mcFvCdur3XF2GnoR0BrAJm/PwLMMAK2', '864735977', 'Kovo 11-osios g. 599-32', 'administrator'),
(6, 'Tomas', 'Tomaitis', 'darbuotojas@maildrop.cc', '$2b$10$Gl02t1LkEbAl5ySYpmIcXONdX4eNW.PoefwyyH7CKKFC2U0nijlMW', '+37064623133', 'Sodžiaus g. 99, Kretinga', 'employee'),
(7, 'Rokas', 'Beniušis', 'rokas@maildrop.cc', '$2b$10$NtIsOkiFxmCGZ.rINzYZmeXWazpTnEoN7aRewfpZY9pzoqWSEa7ry', '+37064735977', NULL, 'client'),
(8, 'Juozas', 'Juozaitis', 'klientas@maildrop.cc', '$2b$10$NtIdrDNM6hVl1jrUNf03beznpxoimLoompGCplyhR7n3ER/7J/oKi', '863597747', NULL, 'client'),
(9, 'Domas', 'Jurevičius', 'unnamedslap@gmail.com', '$2b$10$ubizvK51tQVDBOxKPU14ruuTYkbhGlfGmMNkeKYPu0rtdvRUgxizm', '861524155', 'J. Basanavičiaus g. 154-20, Kretinga', 'client'),
(10, 'Tomas', 'Lavrinovičius', 'tomasliuks@maildrop.cc', '$2b$10$YL3Ge.tZfsN7FvOmC2PpXeyDldhfsMpt/dSn4dEZpSyd6gqZ6fh/O', '861432166', NULL, 'employee'),
(11, 'Džiugas', 'Matusevičius', 'naujasklientas@maildrop.cc', '$2b$10$X3l/pNzxQmgTEN2LrGC9rus8O6CgozL6LtwwNkUMfrC577DT7zRiG', '+37061421344', NULL, 'client');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('065fadfb-ab19-4078-9908-86684ea466ec', '6355640e3b66dfdb8c5c3e4a9bf972288183370ed73d10ae9e2169cd3ac0e9af', '2023-05-21 18:07:31.913', '20230521180731_8_latest', NULL, NULL, '2023-05-21 18:07:31.891', 1),
('1dad13b9-8d16-41de-913b-678179682cfb', 'bb356dbd798589e636563344f08c28ac0e1a55f06bf79c785f08dd88f0eb993a', '2023-05-30 23:14:49.045', '20230530231449_13_base_repair_cost_addition', NULL, NULL, '2023-05-30 23:14:49.029', 1),
('26a2a976-7cde-44ea-b329-f47dd672c73a', '33cde7ce1236673ca52053d9938f673f903e96b70b82bed91ba86974f8563c42', '2023-05-02 13:33:35.312', '20230502133335_2_datetime_to_string', NULL, NULL, '2023-05-02 13:33:35.272', 1),
('2d1abe68-0760-41e2-87db-8145f84f7f0d', 'c83bcc07082a441917c9e1eb452e466165aff0a9412e46cb34f92b4f902809b5', '2023-05-30 23:37:41.861', '20230530233741_14_reverse', NULL, NULL, '2023-05-30 23:37:41.844', 1),
('31547af0-8ad0-4a55-a860-5dfa1619782f', 'ae4a64bf28660c35ba85d184f5d6ad65b1cf683b51263cd025e7fc19aa2fcbe3', '2023-05-04 12:15:09.980', '20230504121509_7_fixes_based_on_database_model', NULL, NULL, '2023-05-04 12:15:09.935', 1),
('396ad0dc-7aef-4095-ad0d-dd5db8de34f4', '9b17f4c794c01bd0063dd893a14c5c378d60e0a80a302904b8f99db9f50caee3', '2023-05-03 14:26:00.828', '20230503142600_4_changes', NULL, NULL, '2023-05-03 14:26:00.490', 1),
('4d95894e-35e2-48fe-aa26-b8ce0b3bfc61', 'f1684595b29acb8bfef1894b78097f77d6fd8d961e7397ce57d211401738ddfe', '2023-04-30 12:43:13.459', '20230430124313_0_init', NULL, NULL, '2023-04-30 12:43:13.206', 1),
('4e5b39e9-a23e-49da-9aa5-18267004b539', '2ba2a7527f8e0e9bae480daebe71cb8ef2db608006b1a45d6c71f9119b7c960c', '2023-05-02 16:51:21.286', '20230502165121_3_reservation_table_edits', NULL, NULL, '2023-05-02 16:51:21.251', 1),
('52743587-3806-4dd9-a27d-63cf52b68d6a', '1dd0c4c6b71854583058efab8f2c3be39608c9e7b541a65486899ec7cf4c4b34', '2023-05-29 11:42:17.762', '20230529114217_9_fixed_relations', NULL, NULL, '2023-05-29 11:42:17.723', 1),
('72282e79-01ce-4d94-9e3b-2ad7c50bdfc8', '3c48a50eccde792e6ef895261f32e5af9d9a26e7d8478eaf18572714a382e63e', '2023-05-03 15:26:26.380', '20230503152626_6_estimated_time_to_datetime', NULL, NULL, '2023-05-03 15:26:26.336', 1),
('74976345-6a94-4c68-b7d8-c3d0f64de19d', 'b9cb5e3992e654f385c97b5ad32808a33869a680600bec67c916ce5423b283e8', '2023-05-30 15:51:49.571', '20230530155149_12_task_table_updated', NULL, NULL, '2023-05-30 15:51:49.556', 1),
('92005ae8-5dfe-4df5-ae76-e27de2ac894c', '59c5dd3a0c91200917663f36da0da19bfd152789c5c4b530c0bed72b7e435197', '2023-05-29 11:44:15.296', '20230529114415_10_fixed_relations', NULL, NULL, '2023-05-29 11:44:15.120', 1),
('b11e00c2-1b5a-4967-a3f3-f58b285db668', '03d75fc43b2b328ea95aa170a5551283c02b2954ecccdcc585ff580ac983cee8', '2023-05-02 12:51:00.188', '20230502125100_1_task_table_changes', NULL, NULL, '2023-05-02 12:51:00.176', 1),
('d1d0bb96-b274-4476-8772-d63bf84cef6d', '3703739ac91933c3eb29f554c24bc2a200dc6eee5d228e886e641c72ebb4c6a2', '2023-05-03 14:48:52.303', '20230503144852_5_datetime_string_changes', NULL, NULL, '2023-05-03 14:48:52.211', 1),
('e6faf873-be0b-41c2-992d-7cbb879548e9', '76683eba8f9f60c016dd8670fd92037a312af1e0da3c673adaa429d65e792665', '2023-05-30 13:27:17.721', '20230530132717_11_task_table', NULL, NULL, '2023-05-30 13:27:17.665', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_repair` (`fk_repair`);

--
-- Indexes for table `repair`
--
ALTER TABLE `repair`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_client` (`fk_user_client`),
  ADD KEY `fk_user_employee` (`fk_user_employee`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`fk_user`);

--
-- Indexes for table `reservation_hours`
--
ALTER TABLE `reservation_hours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_ibfk_1` (`fk_repair`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `repair`
--
ALTER TABLE `repair`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `reservation_hours`
--
ALTER TABLE `reservation_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `offer`
--
ALTER TABLE `offer`
  ADD CONSTRAINT `offer_ibfk_1` FOREIGN KEY (`fk_repair`) REFERENCES `repair` (`id`);

--
-- Constraints for table `repair`
--
ALTER TABLE `repair`
  ADD CONSTRAINT `repair_ibfk_1` FOREIGN KEY (`fk_user_client`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `repair_ibfk_2` FOREIGN KEY (`fk_user_employee`) REFERENCES `user` (`id`);

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`fk_user`) REFERENCES `user` (`id`);

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`fk_repair`) REFERENCES `repair` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
