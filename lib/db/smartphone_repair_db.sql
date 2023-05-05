-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2023 at 07:57 AM
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
(3, 'Išmaniojo telefono vidinio stiklo pakeitimas', '2023-05-03 17:59:00', '2023-05-04 08:10:00', '2023-05-04 09:40:00', '2023-05-04 10:00:00', 229.23, 'finished', NULL, NULL, 26, 29),
(7, 'Remontas 2', '2023-05-03 17:40:17', NULL, NULL, NULL, 99.99, 'registered', NULL, NULL, 26, 29);

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

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`id`, `fk_user`, `date`, `time`) VALUES
(13, 26, '2023-05-02', '16:30:00'),
(14, 30, '2023-05-04', '12:00:00');

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
(1, 30, '08:00:00', '17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` char(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_repair` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(26, 'Rokas', 'Beniušis', 'rokas@gmail.com', '$2b$10$rCvRXz5Dezwdef1ooMCaOuq7mzpeutPN8RDR9CvJCZoV8w5AjFjnS', '+37064735977', 'Kovo 11-osios g. 29, Kaunas', 'client'),
(29, 'Tomas', 'Jablonskis', 'darbuotojas@gmail.com', '$2b$10$QYCxeK0W7vxP6CcIiDjXNOBlk2xLWNcbSyE1I7byYoYpOkLZNLhQG', '+37064735977', 'Šiaulių g. 19, Panevėžys', 'employee'),
(30, 'Mantas', 'Jankauskas', 'admin@gmail.com', '$2b$10$IsAS1MzNTdybBvmXDeLLTeq.TH.oiD0WQnACMnU3oTwvTda8hANxe', '864735977', 'Vilniaus g. 19, Kaunas', 'administrator'),
(31, 'Jonas', 'Jonauskas', 'test@gmail.com', '$2b$10$UiEZAua4qZAFndgpWNd86.b3Fnq7TJLmglniYhujbHE6cmJciWFm6', '+37064532611', NULL, 'client'),
(32, 'Mantas', 'Jonauskas', 'testinis@outlook.com', '$2b$10$QhlNlNrDfk9aex9RTY8s2.iF8BydmKeP9sXlrhzQ6xVq8L8f3B7WW', '864619546', NULL, 'client');

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
('26a2a976-7cde-44ea-b329-f47dd672c73a', '33cde7ce1236673ca52053d9938f673f903e96b70b82bed91ba86974f8563c42', '2023-05-02 13:33:35.312', '20230502133335_2_datetime_to_string', NULL, NULL, '2023-05-02 13:33:35.272', 1),
('31547af0-8ad0-4a55-a860-5dfa1619782f', 'ae4a64bf28660c35ba85d184f5d6ad65b1cf683b51263cd025e7fc19aa2fcbe3', '2023-05-04 12:15:09.980', '20230504121509_7_fixes_based_on_database_model', NULL, NULL, '2023-05-04 12:15:09.935', 1),
('396ad0dc-7aef-4095-ad0d-dd5db8de34f4', '9b17f4c794c01bd0063dd893a14c5c378d60e0a80a302904b8f99db9f50caee3', '2023-05-03 14:26:00.828', '20230503142600_4_changes', NULL, NULL, '2023-05-03 14:26:00.490', 1),
('4d95894e-35e2-48fe-aa26-b8ce0b3bfc61', 'f1684595b29acb8bfef1894b78097f77d6fd8d961e7397ce57d211401738ddfe', '2023-04-30 12:43:13.459', '20230430124313_0_init', NULL, NULL, '2023-04-30 12:43:13.206', 1),
('4e5b39e9-a23e-49da-9aa5-18267004b539', '2ba2a7527f8e0e9bae480daebe71cb8ef2db608006b1a45d6c71f9119b7c960c', '2023-05-02 16:51:21.286', '20230502165121_3_reservation_table_edits', NULL, NULL, '2023-05-02 16:51:21.251', 1),
('72282e79-01ce-4d94-9e3b-2ad7c50bdfc8', '3c48a50eccde792e6ef895261f32e5af9d9a26e7d8478eaf18572714a382e63e', '2023-05-03 15:26:26.380', '20230503152626_6_estimated_time_to_datetime', NULL, NULL, '2023-05-03 15:26:26.336', 1),
('b11e00c2-1b5a-4967-a3f3-f58b285db668', '03d75fc43b2b328ea95aa170a5551283c02b2954ecccdcc585ff580ac983cee8', '2023-05-02 12:51:00.188', '20230502125100_1_task_table_changes', NULL, NULL, '2023-05-02 12:51:00.176', 1),
('d1d0bb96-b274-4476-8772-d63bf84cef6d', '3703739ac91933c3eb29f554c24bc2a200dc6eee5d228e886e641c72ebb4c6a2', '2023-05-03 14:48:52.303', '20230503144852_5_datetime_string_changes', NULL, NULL, '2023-05-03 14:48:52.211', 1);

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
  ADD KEY `fk_repair` (`fk_repair`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `repair`
--
ALTER TABLE `repair`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `reservation_hours`
--
ALTER TABLE `reservation_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
