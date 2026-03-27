-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 23, 2026 at 08:23 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `marsai`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_decisions`
--

CREATE TABLE `admin_decisions` (
  `id` int NOT NULL,
  `submission_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_user_id` int NOT NULL,
  `decision` enum('validated','refused','review') COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `email_sent` tinyint(1) NOT NULL DEFAULT '0',
  `badge` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prize` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `decided_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jury_assignments`
--

CREATE TABLE `jury_assignments` (
  `id` int NOT NULL,
  `jury_user_id` int NOT NULL,
  `submission_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assigned_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jury_votes`
--

CREATE TABLE `jury_votes` (
  `id` int NOT NULL,
  `submission_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jury_user_id` int NOT NULL,
  `action` enum('validate','refuse','review') COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `voted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `synopsis` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `duration_seconds` int NOT NULL,
  `ai_tools` json DEFAULT NULL,
  `semantic_tags` json DEFAULT NULL,
  `music_credits` text COLLATE utf8mb4_unicode_ci,
  `rights_confirmed` tinyint(1) NOT NULL DEFAULT '0',
  `director_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `director_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `director_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_zip` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_birthdate` date DEFAULT NULL,
  `director_job` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_socials` json DEFAULT NULL,
  `discovery_source` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legal_ref_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legal_ref_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poster_url` text COLLATE utf8mb4_unicode_ci,
  `video_url` text COLLATE utf8mb4_unicode_ci,
  `subtitles_url` text COLLATE utf8mb4_unicode_ci,
  `youtube_private_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube_public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consent_rules` tinyint(1) NOT NULL DEFAULT '0',
  `consent_promo` tinyint(1) NOT NULL DEFAULT '0',
  `consent_newsletter` tinyint(1) NOT NULL DEFAULT '0',
  `consent_copyright` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('pending','validated','refused','review','selected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `google_sub_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','moderator','jury') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_decisions`
--
ALTER TABLE `admin_decisions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_admin_decisions_submission` (`submission_id`),
  ADD KEY `fk_admin_decisions_user` (`admin_user_id`);

--
-- Indexes for table `jury_assignments`
--
ALTER TABLE `jury_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_jury_assignment` (`jury_user_id`,`submission_id`),
  ADD KEY `fk_jury_assignments_submission` (`submission_id`);

--
-- Indexes for table `jury_votes`
--
ALTER TABLE `jury_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_jury_vote` (`submission_id`,`jury_user_id`),
  ADD KEY `fk_jury_votes_user` (`jury_user_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `google_sub_id` (`google_sub_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_decisions`
--
ALTER TABLE `admin_decisions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jury_assignments`
--
ALTER TABLE `jury_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jury_votes`
--
ALTER TABLE `jury_votes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_decisions`
--
ALTER TABLE `admin_decisions`
  ADD CONSTRAINT `fk_admin_decisions_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_admin_decisions_user` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jury_assignments`
--
ALTER TABLE `jury_assignments`
  ADD CONSTRAINT `fk_jury_assignments_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jury_assignments_user` FOREIGN KEY (`jury_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jury_votes`
--
ALTER TABLE `jury_votes`
  ADD CONSTRAINT `fk_jury_votes_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jury_votes_user` FOREIGN KEY (`jury_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
