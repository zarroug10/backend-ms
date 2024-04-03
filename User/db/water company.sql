-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 03 avr. 2024 à 18:37
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `water company`
--

-- --------------------------------------------------------

--
-- Structure de la table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `message` text NOT NULL,
  `incidentId` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `userId`, `message`, `incidentId`, `created_at`) VALUES
(2, 52, 'This is a test feedback message.', 4, '2024-03-13 05:31:43');

-- --------------------------------------------------------

--
-- Structure de la table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `media` varchar(255) DEFAULT NULL,
  `status` enum('reported','assigned','in_progress','resolved') DEFAULT 'reported',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `incidents`
--

INSERT INTO `incidents` (`id`, `title`, `description`, `location`, `latitude`, `longitude`, `media`, `status`, `created_at`, `updated_at`, `userId`) VALUES
(1, 'Water Leak', 'There is a water leak in the basement.', 'ibni ali', 33.87620700, 7.92490100, '1708020169440-RSI9.jpg', 'resolved', '2024-03-07 21:55:11', '2024-03-16 10:25:41', 48),
(2, 'Water Leak', 'There is a water leak in the basement.', 'Ward Naam', 33.87620700, 7.91490100, '1708020169440-RSI9.jpg', 'resolved', '2024-03-07 21:57:18', '2024-03-16 10:13:30', 50),
(3, 'Damaged pipe', 'There is a water leak', 'shourfa', 33.87620700, 7.89490100, 'Angular_full_color_logo.svg.png', 'reported', '2024-03-11 16:47:15', '2024-03-16 10:26:06', 48),
(4, 'Damaged pipe', 'Damaged pip', 'Gataaya', 33.87620700, 7.90490100, 'Bard_Generated_Image.png', 'reported', '2024-03-12 06:02:07', '2024-03-16 04:56:35', 50),
(5, 'damaged pip', 'hello ', 'Zawya', 33.87570700, 7.88490100, '1708023047463-69805_Little_Nightmares_II.jpg', 'reported', '2024-03-15 05:03:39', '2024-03-16 04:40:16', 4),
(8, 'damaged pip', 'hello ', 'Zawya', 33.87570700, 7.88490100, '1708023047463-69805_Little_Nightmares_II.jpg', 'in_progress', '2024-03-15 05:03:39', '2024-03-16 11:29:26', 4),
(9, 'damaged pip', 'hello this a an emergency ', 'ibni ali', 33.87568800, 7.88489900, '1711553430459-smiling-mature-couple-meeting-bank-600nw-2259811269.jpg', 'reported', '2024-03-27 15:30:30', '2024-03-27 15:37:10', 4),
(12, 'water problem', 'there are a water leakage in the alley', 'ibni ali', 0.00000000, 0.00000000, '1711555410313-smiling-mature-couple-meeting-bank-600nw-2259811269.jpg', 'reported', '2024-03-27 16:03:30', '2024-03-27 16:03:30', 4),
(13, 'water problem', 'scqsc dsfc', 'ibni ali', 0.00000000, 0.00000000, '1711555485750-Bard_Generated_Image (1).jpg', 'reported', '2024-03-27 16:04:45', '2024-03-27 16:04:45', 4);

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `location` text NOT NULL,
  `messageContent` text NOT NULL,
  `userId` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `location`, `messageContent`, `userId`, `created_at`) VALUES
(4, 'Zawya', 'Hello from the Water Company!', 4, '2024-03-28 16:13:21'),
(6, 'Nafta', 'Hello from the Water Company!', 4, '2024-03-28 16:17:57');

-- --------------------------------------------------------

--
-- Structure de la table `repairreports`
--

CREATE TABLE `repairreports` (
  `id` int(11) NOT NULL,
  `description` text NOT NULL,
  `duration` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `repairreports`
--

INSERT INTO `repairreports` (`id`, `description`, `duration`, `userId`, `created_at`) VALUES
(1, 'Fixed leaking pipe', 60, 48, '2024-03-12 04:58:56'),
(2, 'Fixed leaking pipe', 60, 50, '2024-03-12 05:01:11');

-- --------------------------------------------------------

--
-- Structure de la table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `incidentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `teams`
--

INSERT INTO `teams` (`id`, `name`, `createdAt`, `updatedAt`, `incidentId`) VALUES
(1, 'Team Name', '2024-03-02 19:17:22', '2024-03-02 19:17:22', NULL),
(2, 'Team 1', '2024-03-02 19:32:45', '2024-03-02 19:32:45', NULL),
(4, 'Team 3', '2024-03-02 20:09:02', '2024-03-02 20:09:02', NULL),
(5, 'Team Alpha', '2024-03-21 10:29:36', '2024-03-21 10:29:36', NULL),
(6, 'Team Omega', '2024-03-22 08:41:36', '2024-03-22 08:41:36', NULL),
(7, 'Team Omega', '2024-03-22 08:42:13', '2024-03-22 08:42:13', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `userType` enum('client','technician','chief','Admin') DEFAULT 'client',
  `tel` varchar(255) NOT NULL,
  `cin` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `teamId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `location`, `userType`, `tel`, `cin`, `createdAt`, `updatedAt`, `teamId`) VALUES
(1, 'example_user', 'user@example.com', '$2b$10$y.FPLwGz7xFPJ2q6HGP1P.GPz5EoKtGpd48wbp5zgPYpWnCY43jlG', 'example_location', 'client', '12345678', '12345678', '2024-03-02 18:55:17', '2024-03-02 18:55:17', NULL),
(2, 'client2', 'client2@example.com', '$2b$10$cg5y2izCsqA0KqujbC/MHOEKZaofc0XP9TAMIDmsjaTRsFEroGvHi', 'Location2', 'client', '23456789', '23456789', '2024-03-02 18:56:23', '2024-03-02 18:56:23', NULL),
(3, 'client3', 'client3@example.com', '$2b$10$7.hL9AaHa1AlEvSghZdmQucmnK5YVhY.3aa6wEG9pj.DQPz.qGIVi', 'Location3', 'client', '34567890', '34567890', '2024-03-02 18:56:34', '2024-03-02 18:56:34', NULL),
(4, 'chief', 'chief1@example.com', '$2b$10$SiIw75qzxoAHhtwCgWYF6OOYoBWVDF0M4rzQJV9sdvW.gYtCApGJO', 'Zawya', 'chief', '45678901', '09723561', '2024-03-02 18:56:46', '2024-03-23 12:34:51', 5),
(5, 'admin1', 'admin1@example.com', '$2b$10$.6o6Onnorxg1yS5QoumHkOy7HdA78eg.vVv7KA6/jzH1Rsca95E9O', 'Admin Location', 'Admin', '56789012', '56789012', '2024-03-02 18:57:00', '2024-03-02 18:57:00', NULL),
(9, 'Sami Lazrag', 'SamiLazrag@example.com', '$2b$10$SGz4oCT/Xe0u4zAxU0VjmuJz8bboisMOInQY1NVsfJOfSki7T7dwO', 'Technician Location 1', 'technician', '00118823', '00118823', '2024-03-02 19:00:41', '2024-03-21 10:29:36', 5),
(12, 'layith', 'layith@gmail.com', '$2b$10$IslJhCj936LlxLDg9kn7MeA1m.VXyhr7/.Vf.Q6CoLG0d3iV4ZNtK', 'Zawya', 'technician', '09722131', '31256321', '2024-03-07 20:26:37', '2024-03-21 10:29:36', 5),
(16, 'Zarroug  abdelhafidh', 'zarrougabdelhafidh10@gmail.com', '$2b$10$/ZO/SgcPbX2mvskIIDu/J.qlH4Gz1.S3/qSU0Hljg9Kt58aX1eozW', 'Zawya', 'technician', '26143383', '09723562', '2024-03-09 03:29:14', '2024-03-21 10:29:36', 5),
(17, 'Salim Nawres', 'Salim@gmail.com', '$2b$10$umawvAjV.pLm9mirJShGF.URtxxWWJKbOgfxZ38ufrOU7WRETeJE.', 'Nafta', 'technician', '20154231', '22165341', '2024-03-09 21:06:47', '2024-03-22 08:42:14', 7),
(48, 'salim', 'salim@example.com', '$2b$10$DT92lmTUN7O266MJUHSjgOM6OxuBIm6dFPOEwG9pXonMND5MC7nju', 'Zawya', 'client', '22102965', '22102965', '2024-03-11 16:15:10', '2024-03-11 16:15:10', NULL),
(50, 'Hafa', 'Hafa@example.com', '$2b$10$kxPyRYjQSg6hkm3z8IINLOsAd9kXXlQyy5qO/6uPAZBYhKAsgMB86', 'Location', 'client', '09700561', '09700561', '2024-03-12 05:00:21', '2024-03-12 05:00:21', NULL),
(51, 'youcif zarroug', 'youcif@gmail.com', '$2b$10$wSlTiNjPy283ItSO9DZaGeAiMJDp4QbaApgxNhXgXMKI66LFkg0Vi', 'Nafta', 'technician', '20154555', '22215222', '2024-03-13 04:36:38', '2024-03-22 08:42:14', 7),
(52, 'salim', 'salim22@example.com', '$2b$10$.rkL7CVJ0aTMbcJ9xu4UgO8w15bgAY9jfq/hZjQfmXKJrwzboNPR.', 'Location', 'client', '33114764', '33114764', '2024-03-13 05:13:23', '2024-03-13 05:13:23', NULL),
(56, 'Yazan', 'Yazan@gmail.com', '$2b$10$OysgL9Q3BE2Vb4GYn165yONy8Z872I/qMyeNrbxb/.9oCzJaWue32', 'Tunis', 'technician', '20154123', '22215123', '2024-03-18 12:34:55', '2024-03-22 08:42:14', 7),
(59, 'haithem', 'haithem@gmail.com', '$2b$10$XYHCQYm6qjAsm7GKncGKU.ejRlkb3/0JpZVUzN3rIbxE3B37cHu8i', 'Nafta', 'technician', '09865123', '09865123', '2024-03-18 12:46:07', '2024-03-18 12:46:07', NULL),
(60, 'louay', 'louay@gmail.com', '$2b$10$W0rxk.0sa/o7AwS/QwYNs.G9zKp/g/9pev5LMiHZBjajmk7zXVk8u', 'Nafta', 'client', '10066213', '10066213', '2024-03-28 16:26:52', '2024-03-28 16:26:52', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `incidentId` (`incidentId`);

--
-- Index pour la table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_userId` (`userId`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `repairreports`
--
ALTER TABLE `repairreports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `tel` (`tel`),
  ADD UNIQUE KEY `cin` (`cin`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `repairreports`
--
ALTER TABLE `repairreports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`incidentId`) REFERENCES `incidents` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `repairreports`
--
ALTER TABLE `repairreports`
  ADD CONSTRAINT `repairreports_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
