-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 17, 2026 at 08:09 AM
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

--
-- Dumping data for table `admin_decisions`
--

INSERT INTO `admin_decisions` (`id`, `submission_id`, `admin_user_id`, `decision`, `comment`, `email_sent`, `badge`, `prize`, `decided_at`) VALUES
(21, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 10:50:07'),
(22, '99999999-9999-9999-9999-999999999999', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 10:50:10'),
(23, '77777777-7777-7777-7777-777777777777', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 10:50:12'),
(24, '66666666-6666-6666-6666-666666666666', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 10:50:13'),
(25, '55555555-5555-5555-5555-555555555555', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 10:50:14'),
(26, '44444444-4444-4444-4444-444444444444', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 10:50:16'),
(27, '22222222-2222-2222-2222-222222222222', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 10:50:18'),
(28, '11111111-1111-1111-1111-111111111111', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 10:50:19'),
(29, '11111111-1111-1111-1111-111111111111', 2, 'validated', NULL, 1, NULL, NULL, '2026-03-05 10:51:37'),
(30, '11111111-1111-1111-1111-111111111111', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 10:52:17'),
(31, '11111111-1111-1111-1111-111111111111', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 10:52:20'),
(32, '11111111-1111-1111-1111-111111111111', 2, 'validated', NULL, 1, 'prix_jury', NULL, '2026-03-05 10:53:12'),
(33, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 13:14:21'),
(34, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 13:14:54'),
(35, '11111111-1111-1111-1111-111111111111', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 13:14:58'),
(36, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-05 13:16:02'),
(37, 'b9e1b3e2-306c-4901-86d1-d91ee8400815', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 13:16:04'),
(38, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 13:16:05'),
(39, 'b9e1b3e2-306c-4901-86d1-d91ee8400815', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 13:16:07'),
(40, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 13:20:56'),
(41, 'b9e1b3e2-306c-4901-86d1-d91ee8400815', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 13:20:57'),
(42, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 13:20:58'),
(43, 'b9e1b3e2-306c-4901-86d1-d91ee8400815', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 13:21:00'),
(44, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 13:21:47'),
(45, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 13:23:05'),
(46, '5068dfdf-1ffa-4a95-8f1b-49617a2b106c', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:07:48'),
(47, 'fd922ed3-d900-43eb-a1f0-8adafcb682a4', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:07:50'),
(48, '8624b443-7fe1-4100-80c1-ff1ce2ef4e71', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:07:54'),
(49, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:27:54'),
(50, 'b9e1b3e2-306c-4901-86d1-d91ee8400815', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:27:56'),
(51, '12b39451-b0dd-489a-8305-99cc5ca0bbf3', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:27:58'),
(52, 'a405cb0d-ec1e-4835-bd0b-d85184c2e90a', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:27:59'),
(53, 'a927ec86-0612-420a-9999-ede9751e1390', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:28:02'),
(54, '38e6b188-e802-44ad-931e-3ed9f6177935', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:28:05'),
(55, 'b9e1b3e2-306c-4901-86d1-d91ee8400815', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 14:29:32'),
(56, '6c5a2358-7a82-48f2-acb4-861d286fe1fd', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:31:37'),
(57, 'fa8a2f29-da34-461a-902b-0f19446d3550', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:32:22'),
(58, 'f0062175-9023-457b-9a5b-d41894e7ba15', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:32:27'),
(59, 'b0ebdf3c-498b-44c8-a3ff-281b83c72ec3', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:32:32'),
(60, '12b39451-b0dd-489a-8305-99cc5ca0bbf3', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 14:41:34'),
(61, 'a405cb0d-ec1e-4835-bd0b-d85184c2e90a', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 14:41:35'),
(62, 'a405cb0d-ec1e-4835-bd0b-d85184c2e90a', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:41:47'),
(63, 'a927ec86-0612-420a-9999-ede9751e1390', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 14:41:50'),
(64, '38e6b188-e802-44ad-931e-3ed9f6177935', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 14:41:52'),
(65, '12b39451-b0dd-489a-8305-99cc5ca0bbf3', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:41:59'),
(66, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:42:22'),
(67, '91fc2bd1-2169-45ca-b5b7-351c39468f18', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 14:42:25'),
(68, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:08:59'),
(69, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-05 16:09:28'),
(70, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-05 16:09:32'),
(71, '91fc2bd1-2169-45ca-b5b7-351c39468f18', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-05 16:09:33'),
(72, '6c5a2358-7a82-48f2-acb4-861d286fe1fd', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-05 16:09:35'),
(73, 'fa8a2f29-da34-461a-902b-0f19446d3550', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-05 16:09:37'),
(74, '91fc2bd1-2169-45ca-b5b7-351c39468f18', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:28'),
(75, '6c5a2358-7a82-48f2-acb4-861d286fe1fd', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:30'),
(76, 'fa8a2f29-da34-461a-902b-0f19446d3550', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:31'),
(77, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:34'),
(78, 'f0062175-9023-457b-9a5b-d41894e7ba15', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:35'),
(79, 'b0ebdf3c-498b-44c8-a3ff-281b83c72ec3', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:36'),
(80, '5068dfdf-1ffa-4a95-8f1b-49617a2b106c', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:37'),
(81, 'fd922ed3-d900-43eb-a1f0-8adafcb682a4', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:38'),
(82, '8624b443-7fe1-4100-80c1-ff1ce2ef4e71', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:39'),
(83, '12b39451-b0dd-489a-8305-99cc5ca0bbf3', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:42'),
(84, 'a405cb0d-ec1e-4835-bd0b-d85184c2e90a', 2, 'validated', NULL, 0, 'prix_jury', NULL, '2026-03-05 16:10:44'),
(85, '12b39451-b0dd-489a-8305-99cc5ca0bbf3', 2, 'review', NULL, 0, NULL, NULL, '2026-03-05 16:11:29'),
(86, '12b39451-b0dd-489a-8305-99cc5ca0bbf3', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-05 16:11:30'),
(87, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 2, 'refused', NULL, 0, NULL, NULL, '2026-03-06 09:48:05'),
(88, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 2, 'validated', NULL, 1, NULL, NULL, '2026-03-06 09:48:06'),
(89, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 2, 'validated', NULL, 1, NULL, NULL, '2026-03-06 09:49:15'),
(90, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-06 09:49:57'),
(91, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-06 09:50:24'),
(92, '2ebf930a-cd11-4cc1-bac7-ff7ba152df71', 33, 'validated', NULL, 0, NULL, NULL, '2026-03-06 10:30:46'),
(93, '91fc2bd1-2169-45ca-b5b7-351c39468f18', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:34:48'),
(94, '6c5a2358-7a82-48f2-acb4-861d286fe1fd', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:34:49'),
(95, 'fa8a2f29-da34-461a-902b-0f19446d3550', 2, 'validated', NULL, 1, NULL, NULL, '2026-03-09 12:34:50'),
(96, 'f0062175-9023-457b-9a5b-d41894e7ba15', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:34:52'),
(97, 'b0ebdf3c-498b-44c8-a3ff-281b83c72ec3', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:34:53'),
(98, '5068dfdf-1ffa-4a95-8f1b-49617a2b106c', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:34:55'),
(99, 'fd922ed3-d900-43eb-a1f0-8adafcb682a4', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:34:57'),
(100, '8624b443-7fe1-4100-80c1-ff1ce2ef4e71', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:34:58'),
(101, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:34:59'),
(102, 'a405cb0d-ec1e-4835-bd0b-d85184c2e90a', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:35:07'),
(103, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:35:22'),
(104, '90df02a3-59d3-4eb1-9324-7519e4777152', 37, 'validated', NULL, 0, NULL, NULL, '2026-03-09 12:41:38'),
(105, '2ebf930a-cd11-4cc1-bac7-ff7ba152df71', 37, 'refused', NULL, 0, NULL, NULL, '2026-03-09 12:42:05'),
(106, '91fc2bd1-2169-45ca-b5b7-351c39468f18', 37, 'review', NULL, 1, NULL, NULL, '2026-03-09 12:46:45'),
(107, '6c5a2358-7a82-48f2-acb4-861d286fe1fd', 37, 'review', NULL, 0, NULL, NULL, '2026-03-09 12:46:47'),
(108, '90df02a3-59d3-4eb1-9324-7519e4777152', 37, 'refused', NULL, 0, NULL, NULL, '2026-03-09 12:47:43'),
(109, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 11:38:02'),
(110, '2ebf930a-cd11-4cc1-bac7-ff7ba152df71', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 11:38:04'),
(111, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 1, NULL, NULL, '2026-03-11 11:38:06'),
(112, '2ebf930a-cd11-4cc1-bac7-ff7ba152df71', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 11:38:08'),
(113, 'b9e1b3e2-306c-4901-86d1-d91ee8400815', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:26'),
(114, '12b39451-b0dd-489a-8305-99cc5ca0bbf3', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:29'),
(115, 'a927ec86-0612-420a-9999-ede9751e1390', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:31'),
(116, '38e6b188-e802-44ad-931e-3ed9f6177935', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:32'),
(117, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:34'),
(118, '99999999-9999-9999-9999-999999999999', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:36'),
(119, '88888888-8888-8888-8888-888888888888', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:37'),
(120, '77777777-7777-7777-7777-777777777777', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:41'),
(121, '66666666-6666-6666-6666-666666666666', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:42'),
(122, '55555555-5555-5555-5555-555555555555', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:43'),
(123, '44444444-4444-4444-4444-444444444444', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:45'),
(124, '33333333-3333-3333-3333-333333333333', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:46'),
(125, '22222222-2222-2222-2222-222222222222', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-11 13:09:48'),
(126, '11111111-1111-1111-1111-111111111111', 2, 'validated', NULL, 1, NULL, NULL, '2026-03-11 13:09:50'),
(127, '2ebf930a-cd11-4cc1-bac7-ff7ba152df71', 2, 'review', NULL, 0, NULL, NULL, '2026-03-12 11:51:12'),
(128, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'refused', NULL, 1, NULL, NULL, '2026-03-13 11:04:39'),
(129, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-13 12:36:10'),
(130, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-13 12:36:13'),
(131, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-13 12:36:22'),
(132, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'review', NULL, 0, NULL, NULL, '2026-03-13 12:36:24'),
(133, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'refused', NULL, 0, NULL, NULL, '2026-03-13 12:36:29'),
(134, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-13 13:03:54'),
(135, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-13 13:03:56'),
(136, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, 'grand_prix', NULL, '2026-03-13 13:10:13'),
(137, '90df02a3-59d3-4eb1-9324-7519e4777152', 2, 'validated', NULL, 0, NULL, NULL, '2026-03-13 13:10:17'),
(138, '91fc2bd1-2169-45ca-b5b7-351c39468f18', 2, 'validated', NULL, 1, NULL, NULL, '2026-03-13 15:42:36'),
(139, '91fc2bd1-2169-45ca-b5b7-351c39468f18', 2, 'refused', NULL, 1, NULL, NULL, '2026-03-13 15:44:12');

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

--
-- Dumping data for table `jury_assignments`
--

INSERT INTO `jury_assignments` (`id`, `jury_user_id`, `submission_id`, `assigned_at`) VALUES
(55, 1, '90df02a3-59d3-4eb1-9324-7519e4777152', '2026-03-12 11:51:52'),
(56, 1, '2ebf930a-cd11-4cc1-bac7-ff7ba152df71', '2026-03-12 11:51:52'),
(57, 1, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', '2026-03-12 11:51:52'),
(58, 1, '91fc2bd1-2169-45ca-b5b7-351c39468f18', '2026-03-12 11:51:52'),
(59, 1, '6c5a2358-7a82-48f2-acb4-861d286fe1fd', '2026-03-12 11:51:52'),
(60, 1, 'fa8a2f29-da34-461a-902b-0f19446d3550', '2026-03-12 11:51:52'),
(61, 1, 'f0062175-9023-457b-9a5b-d41894e7ba15', '2026-03-12 11:51:52'),
(62, 1, 'b0ebdf3c-498b-44c8-a3ff-281b83c72ec3', '2026-03-12 11:51:52'),
(63, 1, '5068dfdf-1ffa-4a95-8f1b-49617a2b106c', '2026-03-12 11:51:52'),
(64, 1, 'fd922ed3-d900-43eb-a1f0-8adafcb682a4', '2026-03-12 11:51:52'),
(65, 1, '8624b443-7fe1-4100-80c1-ff1ce2ef4e71', '2026-03-12 11:51:52'),
(66, 1, '58dc0ca4-b474-4da0-9226-ddc5668a3a50', '2026-03-12 11:51:52'),
(67, 1, 'b9e1b3e2-306c-4901-86d1-d91ee8400815', '2026-03-12 11:51:52'),
(68, 1, '12b39451-b0dd-489a-8305-99cc5ca0bbf3', '2026-03-12 11:51:52'),
(69, 1, 'a405cb0d-ec1e-4835-bd0b-d85184c2e90a', '2026-03-12 11:51:52'),
(70, 1, 'a927ec86-0612-420a-9999-ede9751e1390', '2026-03-12 11:51:52'),
(71, 1, '38e6b188-e802-44ad-931e-3ed9f6177935', '2026-03-12 11:51:52'),
(72, 1, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-03-12 11:51:52'),
(73, 1, '99999999-9999-9999-9999-999999999999', '2026-03-12 11:51:52'),
(74, 1, '88888888-8888-8888-8888-888888888888', '2026-03-12 11:51:52');

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

--
-- Dumping data for table `jury_votes`
--

INSERT INTO `jury_votes` (`id`, `submission_id`, `jury_user_id`, `action`, `comment`, `voted_at`) VALUES
(25, '11111111-1111-1111-1111-111111111111', 1, 'validate', 'Super films !', '2026-03-05 10:52:49'),
(26, 'f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 1, 'validate', 'Merci j\'adore ce film', '2026-03-06 09:48:57'),
(27, '90df02a3-59d3-4eb1-9324-7519e4777152', 1, 'refuse', 'Ton film n\'est pas du tout dans nos mœurs !', '2026-03-13 11:05:24'),
(28, '91fc2bd1-2169-45ca-b5b7-351c39468f18', 1, 'validate', 'super cool comme vidéo !', '2026-03-13 15:37:23');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`key`, `value`, `updated_at`) VALUES
('brevo_sender_email', NULL, '2026-03-13 15:43:02'),
('email_decision_templates', NULL, '2026-03-13 15:43:02'),
('email_submission_received_template', NULL, '2026-03-13 15:43:02'),
('festival_description', NULL, '2026-03-05 09:07:36'),
('footer_text', NULL, '2026-03-05 09:07:36'),
('hero_image_url', NULL, '2026-03-05 09:22:39'),
('home_translations', '{\"fr\":{\"eyebrow\":\"APPEL À FILMS OUVERT\",\"eyebrowClosed\":\"APPEL À FILMS FERMÉ\",\"eyebrowSuffix\":\"· MARSEILLE 2026\",\"terminal\":\"> FESTIVAL_IA_V1.0 // INITIATING{{cursor}}\",\"title1\":\"IMAGINEZ\",\"title2\":\"DES FUTURS\",\"title3\":\"SOUHAITABLES\",\"heroText\":\"Courts-métrages {{duration}} entièrement générés par {{ai}}. Ouvert à tous. Sans inscription.\",\"duration\":\"1–2 min\",\"ai\":\"intelligence artificielle\",\"ctaSubmit\":\"SOUMETTRE UN FILM\",\"ctaCatalogue\":\"VOIR LE CATALOGUE\",\"phaseNoticePhase2\":\"INSCRIPTIONS TERMINÉES · DÉBUT PHASE 2\",\"phaseNoticePhase3\":\"LES JURYS ONT VOTÉ · DÉBUT DE LA PHASE 3\",\"phaseNoticePalmares\":\"LE GRAND PRIX A ÉTÉ DÉCERNÉ · MERCI D\'AVOIR PARTICIPÉ\",\"timeline\":\"TIMELINE · FESTIVAL 2026\",\"phaseLabel\":\"{{phase}} // ACTIVE\",\"dateTbd\":\"> DATE_TBD\",\"countdown\":{\"closed\":\"> SUBMISSIONS_CLOSED\",\"days\":\"Jours\",\"hours\":\"Heures\",\"minutes\":\"Min\",\"seconds\":\"Sec\"},\"stats\":{\"countries\":\"PAYS\",\"filmsExpected\":\"FILMS ATTENDUS\",\"visitors\":\"VISITEURS\"},\"statsNumbers\":{\"countries\":\"120\",\"filmsExpected\":\"600\",\"visitors\":\"3000\"},\"phases\":{\"p1Title\":\"APPEL À FILMS\",\"p1Desc\":\"1–2 min · 100% IA · International\",\"p2Title\":\"SÉLECTION OFFICIELLE\",\"p2Desc\":\"50 films retenus par le jury\",\"p3Title\":\"PALMARÈS\",\"p3Desc\":\"Grand Prix · Prix du Jury · Prix du Public\"},\"place\":\"LA PLATEFORME × MOBILE FILM FESTIVAL\",\"featureTitle1\":\"L\'IA au service\",\"featureTitle2\":\"de la création cinématographique\",\"featureText\":\"marsAI place l\'humain au cœur de la création assistée par IA. Stimulez votre créativité via le format court et rejoignez une communauté internationale autour de l\'IA générative.\",\"featureCta\":\"SOUMETTRE\",\"palmaresCta\":\"PALMARÈS →\",\"featureTags\":[\"1–2 minutes\",\"IA générative\",\"Sans inscription\",\"International\",\"Multi-films\",\"Sous-titres\"],\"scroll\":\"SCROLL\",\"live\":\"LIVE\",\"finished\":\"TERMINÉ\",\"themeTitle\":\"THÈME 2026\",\"themeQuote\":\"\\\"IMAGINEZ DES\\nFUTURS SOUHAITABLES\\\"\"},\"en\":{\"eyebrow\":\"CALL FOR FILMS OPEN\",\"eyebrowClosed\":\"CALL FOR FILMS CLOSED\",\"eyebrowSuffix\":\"· MARSEILLE 2026\",\"terminal\":\"> FESTIVAL_IA_V1.0 // INITIATING{{cursor}}\",\"title1\":\"IMAGINE\",\"title2\":\"DESIRABLE\",\"title3\":\"FUTURES\",\"heroText\":\"Short films {{duration}} fully generated by {{ai}}. Open to all. No signup.\",\"duration\":\"1–2 min\",\"ai\":\"artificial intelligence\",\"ctaSubmit\":\"SUBMIT A FILM\",\"ctaCatalogue\":\"VIEW CATALOGUE\",\"phaseNoticePhase2\":\"SUBMISSIONS CLOSED · PHASE 2 STARTED\",\"phaseNoticePhase3\":\"THE JURY HAS VOTED · PHASE 3 STARTED\",\"phaseNoticePalmares\":\"THE GRAND PRIZE HAS BEEN AWARDED · THANK YOU FOR PARTICIPATING\",\"timeline\":\"TIMELINE · FESTIVAL 2026\",\"phaseLabel\":\"{{phase}} // ACTIVE\",\"dateTbd\":\"> DATE_TBD\",\"countdown\":{\"closed\":\"> SUBMISSIONS_CLOSED\",\"days\":\"Days\",\"hours\":\"Hours\",\"minutes\":\"Min\",\"seconds\":\"Sec\"},\"stats\":{\"countries\":\"COUNTRIES\",\"filmsExpected\":\"EXPECTED FILMS\",\"visitors\":\"VISITORS\"},\"statsNumbers\":{\"countries\":\"120\",\"filmsExpected\":\"600\",\"visitors\":\"3000\"},\"phases\":{\"p1Title\":\"CALL FOR FILMS\",\"p1Desc\":\"1–2 min · 100% AI · International\",\"p2Title\":\"OFFICIAL SELECTION\",\"p2Desc\":\"50 films selected by the jury\",\"p3Title\":\"WINNERS\",\"p3Desc\":\"Grand Prix · Jury Prize · Public Prize\"},\"place\":\"LA PLATEFORME × MOBILE FILM FESTIVAL\",\"featureTitle1\":\"AI in the service\",\"featureTitle2\":\"of cinematic creation\",\"featureText\":\"marsAI puts humans at the heart of AI-assisted creation. Boost your creativity in short form and join an international community around generative AI.\",\"featureCta\":\"SUBMIT\",\"palmaresCta\":\"WINNERS →\",\"featureTags\":[\"1–2 minutes\",\"Generative AI\",\"No signup\",\"International\",\"Multi-films\",\"Subtitles\"],\"scroll\":\"SCROLL\",\"live\":\"LIVE\",\"finished\":\"ENDED\",\"themeTitle\":\"THEME 2026\",\"themeQuote\":\"\\\"IMAGINE DESIRABLE\\nFUTURES\\\"\"}}', '2026-03-13 15:34:46'),
('partners', NULL, '2026-03-05 09:07:36'),
('partners_logos', '[]', '2026-03-12 11:10:18'),
('phase1_close_iso', '2026-05-10T14:10:00.000Z', '2026-03-13 15:34:46'),
('phase2_catalogue_iso', '2026-06-10T11:05:00.000Z', '2026-03-13 15:34:46'),
('phase3_palmares_iso', '2026-06-17T11:10:00.000Z', '2026-03-13 15:34:46'),
('site_logo', NULL, '2026-03-05 09:07:36'),
('submission_ai_tool_suggestions', '[\"Sora\",\"MidJourney\",\"RunwayML\",\"Pika\",\"Kling\",\"DALL-E 3\",\"Stable Diffusion\",\"ElevenLabs\",\"Suno\",\"Udio\",\"MusicGen\",\"Luma AI\",\"Runway Gen-3\",\"HeyGen\",\"D-ID\",\"Synthesia\",\"Autre\"]', '2026-03-13 15:34:46'),
('submission_categories', '[\"Fiction\",\"Documentaire\",\"Expérimental\",\"Animation\",\"Poétique\",\"Contemplatif\",\"Autre\"]', '2026-03-13 15:34:46'),
('submission_countries', '[\"Afghanistan\",\"Afrique du Sud\",\"Albanie\",\"Algérie\",\"Allemagne\",\"Andorre\",\"Angola\",\"Antigua-et-Barbuda\",\"Arabie Saoudite\",\"Argentine\",\"Arménie\",\"Australie\",\"Autriche\",\"Azerbaïdjan\",\"Bahamas\",\"Bahreïn\",\"Bangladesh\",\"Barbade\",\"Belgique\",\"Belize\",\"Bénin\",\"Bhoutan\",\"Biélorussie\",\"Birmanie\",\"Bolivie\",\"Bosnie-Herzégovine\",\"Botswana\",\"Brésil\",\"Brunéi\",\"Bulgarie\",\"Burkina Faso\",\"Burundi\",\"Cabo Verde\",\"Cambodge\",\"Cameroun\",\"Canada\",\"Chili\",\"Chine\",\"Chypre\",\"Colombie\",\"Comores\",\"Congo\",\"Corée du Nord\",\"Corée du Sud\",\"Costa Rica\",\"Côte d\'Ivoire\",\"Croatie\",\"Cuba\",\"Danemark\",\"Djibouti\",\"Dominique\",\"Égypte\",\"Émirats Arabes Unis\",\"Équateur\",\"Érythrée\",\"Espagne\",\"Estonie\",\"Eswatini\",\"États-Unis\",\"Éthiopie\",\"Fidji\",\"Finlande\",\"France\",\"Gabon\",\"Gambie\",\"Géorgie\",\"Ghana\",\"Grèce\",\"Grenade\",\"Guatemala\",\"Guinée\",\"Guinée-Bissau\",\"Guinée équatoriale\",\"Guyana\",\"Haïti\",\"Honduras\",\"Hongrie\",\"Îles Marshall\",\"Îles Salomon\",\"Inde\",\"Indonésie\",\"Irak\",\"Iran\",\"Irlande\",\"Islande\",\"Israël\",\"Italie\",\"Jamaïque\",\"Japon\",\"Jordanie\",\"Kazakhstan\",\"Kenya\",\"Kirghizistan\",\"Kiribati\",\"Koweït\",\"Laos\",\"Lesotho\",\"Lettonie\",\"Liban\",\"Liberia\",\"Libye\",\"Liechtenstein\",\"Lituanie\",\"Luxembourg\",\"Macédoine du Nord\",\"Madagascar\",\"Malaisie\",\"Malawi\",\"Maldives\",\"Mali\",\"Malte\",\"Maroc\",\"Maurice\",\"Mauritanie\",\"Mexique\",\"Micronésie\",\"Moldavie\",\"Monaco\",\"Mongolie\",\"Monténégro\",\"Mozambique\",\"Namibie\",\"Nauru\",\"Népal\",\"Nicaragua\",\"Niger\",\"Nigéria\",\"Norvège\",\"Nouvelle-Zélande\",\"Oman\",\"Ouganda\",\"Ouzbékistan\",\"Pakistan\",\"Palaos\",\"Palestine\",\"Panama\",\"Papouasie-Nouvelle-Guinée\",\"Paraguay\",\"Pays-Bas\",\"Pérou\",\"Philippines\",\"Pologne\",\"Portugal\",\"Qatar\",\"République centrafricaine\",\"République du Congo\",\"République Dominicaine\",\"Roumanie\",\"Royaume-Uni\",\"Russie\",\"Rwanda\",\"Saint-Christophe-et-Niévès\",\"Saint-Marin\",\"Saint-Vincent-et-les-Grenadines\",\"Sainte-Lucie\",\"Salvador\",\"Samoa\",\"Sao Tomé-et-Principe\",\"Sénégal\",\"Serbie\",\"Seychelles\",\"Sierra Leone\",\"Singapour\",\"Slovaquie\",\"Slovénie\",\"Somalie\",\"Soudan\",\"Soudan du Sud\",\"Sri Lanka\",\"Suède\",\"Suisse\",\"Suriname\",\"Syrie\",\"Tadjikistan\",\"Tanzanie\",\"Tchad\",\"Tchéquie\",\"Thaïlande\",\"Timor oriental\",\"Togo\",\"Tonga\",\"Trinité-et-Tobago\",\"Tunisie\",\"Turkménistan\",\"Turquie\",\"Tuvalu\",\"Ukraine\",\"Uruguay\",\"Vanuatu\",\"Vatican\",\"Venezuela\",\"Vietnam\",\"Yémen\",\"Zambie\",\"Zimbabwe\"]', '2026-03-13 15:34:46'),
('submission_discovery_sources', '[\"Réseaux sociaux (Instagram, TikTok…)\",\"Twitter / X\",\"LinkedIn\",\"Bouche à oreille\",\"Presse / Médias\",\"Newsletter\",\"La Plateforme\",\"Mobile Film Festival\",\"Moteur de recherche\",\"Autre\"]', '2026-03-13 15:34:46'),
('submission_jobs', '[\"Réalisateur·rice\",\"Artiste numérique\",\"Designer\",\"Développeur·se\",\"Étudiant·e\",\"Photographe\",\"Vidéaste\",\"Musicien·ne\",\"Autre\"]', '2026-03-13 15:34:46'),
('submission_languages', '[\"Français\",\"Anglais\",\"Espagnol\",\"Portugais\",\"Allemand\",\"Italien\",\"Néerlandais\",\"Luxembourgeois\",\"Danois\",\"Suédois\",\"Norvégien\",\"Islandais\",\"Finnois\",\"Estonien\",\"Letton\",\"Lituanien\",\"Polonais\",\"Tchèque\",\"Slovaque\",\"Slovène\",\"Hongrois\",\"Roumain\",\"Bulgare\",\"Croate\",\"Serbe\",\"Bosnien\",\"Monténégrin\",\"Macédonien\",\"Albanais\",\"Grec\",\"Maltais\",\"Irlandais\",\"Gallois\",\"Basque\",\"Catalan\",\"Galicien\",\"Ukrainien\",\"Biélorusse\",\"Russe\",\"Arménien\",\"Géorgien\",\"Azéri\",\"Kazakh\",\"Kirghize\",\"Tadjik\",\"Turkmène\",\"Ouzbek\",\"Mongol\",\"Turc\",\"Kurde\",\"Arabe\",\"Hébreu\",\"Persan\",\"Pachto\",\"Dari\",\"Ourdou\",\"Hindi\",\"Bengali\",\"Pendjabi\",\"Gujarati\",\"Marathi\",\"Tamoul\",\"Télougou\",\"Kannada\",\"Malayalam\",\"Népalais\",\"Singhalais\",\"Birman\",\"Thaï\",\"Lao\",\"Khmer\",\"Vietnamien\",\"Indonésien\",\"Malais\",\"Tagalog\",\"Coréen\",\"Japonais\",\"Mandarin\",\"Cantonais\",\"Tibétain\",\"Swahili\",\"Amharique\",\"Tigrigna\",\"Somali\",\"Haoussa\",\"Yoruba\",\"Igbo\",\"Zoulou\",\"Xhosa\",\"Afrikaans\",\"Wolof\",\"Peul\",\"Bambara\",\"Lingala\",\"Kinyarwanda\",\"Kirundi\",\"Shona\",\"Malgache\",\"Créole haïtien\",\"Créole mauricien\",\"Samoan\",\"Tongan\",\"Fidjien\",\"Maori\",\"Bislama\",\"Tok Pisin\",\"Inuktitut\",\"Navajo\",\"Quechua\",\"Aymara\",\"Guarani\"]', '2026-03-13 15:34:46'),
('submission_semantic_tags', '[\"Futur souhaitable\",\"Écologie\",\"Humanité & IA\",\"Solidarité\",\"Espoir\",\"Résilience\",\"Utopie\",\"Nature\",\"Paix\",\"Innovation sociale\",\"Diversité\",\"Éducation\",\"Santé\",\"Liberté\",\"Mémoire\"]', '2026-03-13 15:34:46'),
('submission_social_networks', '[{\"key\":\"instagram\",\"label\":\"Instagram\"},{\"key\":\"youtube\",\"label\":\"YouTube\"},{\"key\":\"linkedin\",\"label\":\"LinkedIn\"},{\"key\":\"x\",\"label\":\"X / Twitter\"},{\"key\":\"facebook\",\"label\":\"Facebook\"},{\"key\":\"tumblr\",\"label\":\"Tumblr\"}]', '2026-03-13 15:34:46'),
('youtube_auto_copyright_check', '1', '2026-03-13 15:34:46'),
('youtube_channel_id', NULL, '2026-03-12 14:05:27'),
('youtube_channel_name', NULL, '2026-03-12 14:05:27'),
('youtube_default_privacy', 'unlisted', '2026-03-13 15:34:46'),
('youtube_move_to_s3_after_check', '0', '2026-03-13 15:34:46'),
('youtube_oauth_connected_at', NULL, '2026-03-12 14:05:27'),
('youtube_oauth_refresh_token_enc', NULL, '2026-03-12 14:05:27');

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

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`id`, `title`, `synopsis`, `country`, `language`, `category`, `year`, `duration_seconds`, `ai_tools`, `semantic_tags`, `music_credits`, `rights_confirmed`, `director_name`, `director_email`, `director_phone`, `director_street`, `director_zip`, `director_city`, `director_country`, `director_birthdate`, `director_job`, `director_socials`, `discovery_source`, `legal_ref_name`, `legal_ref_email`, `poster_url`, `video_url`, `subtitles_url`, `youtube_private_id`, `youtube_public_id`, `consent_rules`, `consent_promo`, `consent_newsletter`, `consent_copyright`, `status`, `created_at`) VALUES
('11111111-1111-1111-1111-111111111111', 'Marseille 2040 : Les Jardins Suspendus', 'Dans un futur proche, Marseille verdit grâce à des jardins suspendus co-créés par citoyens et IA. Une utopie concrète et locale.', 'France', 'Français', 'Fiction', 2026, 118, '[\"Sora\", \"RunwayML\", \"ElevenLabs\"]', '[\"Futur souhaitable\", \"Écologie\", \"Innovation sociale\"]', 'Musique originale générée avec Suno. Voix-off ElevenLabs.', 1, 'Steven Brachet', 'regis.moenaert@aniel.fr', '+33 6 12 34 56 78', '12 rue des Étoiles', '13001', 'Marseille', 'France', '1994-05-21', 'Artiste numérique', '{\"youtube\": \"https://youtube.com/@nadia-ai\", \"instagram\": \"https://instagram.com/nadia.ai\"}', 'Réseaux sociaux (Instagram, TikTok…)', 'Steven Brachet', 'regis.moenaert@aniel.fr', 'https://picsum.photos/seed/marsai_s1/800/1200', 'https://example.com/videos/marsai_s1.mp4', 'https://example.com/subtitles/marsai_s1.vtt', 'yt_private_s1', NULL, 1, 1, 0, 1, 'selected', '2026-02-18 10:49:00'),
('12b39451-b0dd-489a-8305-99cc5ca0bbf3', 'l\'éveil', 'Une immersion visuelle où la nostalgie du cinéma classique rencontre la puissance de l\'intelligence artificielle.', 'France', 'Français', 'Expérimental', 2026, 8, '[\"Sora\", \"DALL-E 3\"]', '[\"Humanité & IA\"]', 'musique généree par sora', 1, 'jean érienafer', 'jean érienafer', '06 94 77 98 56', '12 rue de la lune', '13000', 'Marseille', 'États-Unis', '2004-05-13', 'Vidéaste', '{\"x\": \"harmony\", \"facebook\": \"harmony\", \"instagram\": \"harmony\"}', 'Presse / Médias', 'jean émaclac', 'jeanémaclac@gmail.fr', 'https://s3.fr-par.scw.cloud/tln/grp3/12b39451-b0dd-489a-8305-99cc5ca0bbf3/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/12b39451-b0dd-489a-8305-99cc5ca0bbf3/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/12b39451-b0dd-489a-8305-99cc5ca0bbf3/subtitles.txt', NULL, NULL, 1, 1, 1, 1, 'selected', '2026-03-05 11:33:31'),
('22222222-2222-2222-2222-222222222222', 'La Méditerranée Recomposée', 'Une IA cartographie les futurs de la Méditerranée et révèle des routes solidaires entre les rives. Poétique et documentaire.', 'France', 'Français', 'Documentaire', 2026, 112, '[\"MidJourney\", \"Runway Gen-3\"]', '[\"Solidarité\", \"Nature\", \"Paix\"]', 'Crédits musique : Udio (génération) + montage humain.', 1, 'Lucie Martin', 'lucie.martin@example.com', '+33 6 22 11 33 44', '8 boulevard du Port', '13002', 'Marseille', 'France', '1991-11-02', 'Vidéaste', '{\"linkedin\": \"https://linkedin.com/in/lucie-martin\"}', 'Presse / Médias', 'Lucie Martin', 'lucie.martin@example.com', 'https://picsum.photos/seed/marsai_s2/800/1200', 'https://example.com/videos/marsai_s2.mp4', NULL, 'yt_private_s2', NULL, 1, 1, 1, 1, 'selected', '2026-02-21 10:49:00'),
('2ebf930a-cd11-4cc1-bac7-ff7ba152df71', 'Plage', 'La plage au couché du soleil', 'France', 'Français', 'Contemplatif', 2026, 6, '[\"grok\"]', '[\"Nature\", \"Paix\"]', 'Musique générée par IA', 1, 'Pauline Hiez', 'pauline.hiez@laplateforme.io', '0680330970', '3, boulevard d\'Estiennes d\'Orves', '83200', 'Le Revest-les-eaux', 'France', '1992-01-28', 'Développeur·se', '{}', 'La Plateforme', 'Pauline', 'ok@gmail.com', 'https://s3.fr-par.scw.cloud/tln/grp3/2ebf930a-cd11-4cc1-bac7-ff7ba152df71/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/2ebf930a-cd11-4cc1-bac7-ff7ba152df71/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/2ebf930a-cd11-4cc1-bac7-ff7ba152df71/subtitles.srt', 'yZt-LKoIyLA', NULL, 1, 1, 1, 1, 'pending', '2026-03-06 10:26:36'),
('33333333-3333-3333-3333-333333333333', 'Utopia des Quartiers', 'Des micro-IA de quartier organisent l’entraide au quotidien. Les habitants reprennent le pouvoir sur les décisions locales.', 'France', 'Français', 'Fiction', 2026, 95, '[\"Stable Diffusion\", \"MusicGen\"]', '[\"Utopie\", \"Résilience\", \"Diversité\"]', 'Musique : MusicGen, arrangement final humain.', 1, 'Yanis Azzouzi', 'yanis.azzouzi@example.com', '+33 7 10 20 30 40', '3 rue du Panier', '13002', 'Marseille', 'France', '1998-03-18', 'Designer', '{\"x\": \"https://x.com/yanis_ai\"}', 'Bouche à oreille', 'Yanis Azzouzi', 'yanis.azzouzi@example.com', 'https://picsum.photos/seed/marsai_s3/800/1200', 'https://example.com/videos/marsai_s3.mp4', 'https://example.com/subtitles/marsai_s3.vtt', NULL, NULL, 1, 1, 0, 1, 'selected', '2026-02-23 10:49:00'),
('38e6b188-e802-44ad-931e-3ed9f6177935', 'Le futur démoniaque', 'Il était une fois dans un futur lointain, un humanoïde qui se perd dans l\'espace...', 'France', 'Français', 'Animation', 2026, 75, '[\"MidJourney\", \"Sora\", \"Suno\"]', '[\"Futur souhaitable\"]', 'musique générée par sora', 1, 'Emmanuelle DUPAS-MAHE', 'emmanuelle.dupas-mahe@laplateforme.io', '+33664248214', '84 traverse des Roseaux', '83140', 'SIX-FOURS les PLAGES', 'France', '2001-09-14', 'Développeur·se', '{\"instagram\": \"daffyette7\"}', 'La Plateforme', 'Emmanuelle DUPAS-MAHE', 'emmanuelle.dupas-mahe@laplateforme.io', 'https://s3.fr-par.scw.cloud/tln/grp3/38e6b188-e802-44ad-931e-3ed9f6177935/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/38e6b188-e802-44ad-931e-3ed9f6177935/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/38e6b188-e802-44ad-931e-3ed9f6177935/subtitles.srt', NULL, NULL, 1, 1, 1, 1, 'selected', '2026-03-05 10:55:02'),
('44444444-4444-4444-4444-444444444444', 'Réseau Solidaire', 'Une plateforme open-source, guidée par IA, relie les besoins urgents aux ressources locales. Marseille devient un laboratoire d’entraide.', 'France', 'Français', 'Expérimental', 2026, 120, '[\"Kling\", \"ElevenLabs\"]', '[\"Solidarité\", \"Espoir\", \"Éducation\"]', 'Voix : ElevenLabs. Sound design : humain.', 1, 'Inès Khellaf', 'ines.khellaf@example.com', '+33 6 55 66 77 88', '20 avenue du Prado', '13008', 'Marseille', 'France', '1990-07-09', 'Développeur·se', '{\"instagram\": \"https://instagram.com/ines.ai\"}', 'LinkedIn', 'Inès Khellaf', 'ines.khellaf@example.com', 'https://picsum.photos/seed/marsai_s4/800/1200', 'https://example.com/videos/marsai_s4.mp4', NULL, 'yt_private_s4', NULL, 1, 1, 0, 1, 'selected', '2026-02-24 10:49:00'),
('5068dfdf-1ffa-4a95-8f1b-49617a2b106c', 'Le robot gentil', 'UN méchant robot s\'attaque au robot gentil...', 'France', 'Français', 'Expérimental', 2026, 65, '[\"MidJourney\", \"Sora\"]', '[\"Futur souhaitable\"]', 'avec sora', 1, 'Emmanuelle DUPAS-MAHE', 'emmanuelle.dupas-mahe@laplateforme.io', '+33664248214', '84 traverse des Roseaux', '83140', 'SIX-FOURS les PLAGES', 'France', '1998-04-01', 'Étudiant·e', '{\"instagram\": \"daffyette7\"}', 'La Plateforme', 'Emmanuelle DUPAS-MAHE', 'emmanuelle.dupas-mahe@laplateforme.io', 'https://s3.fr-par.scw.cloud/tln/grp3/5068dfdf-1ffa-4a95-8f1b-49617a2b106c/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/5068dfdf-1ffa-4a95-8f1b-49617a2b106c/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/5068dfdf-1ffa-4a95-8f1b-49617a2b106c/subtitles.srt', 'KvH2vbMuQE8', NULL, 1, 1, 1, 1, 'selected', '2026-03-05 14:05:46'),
('55555555-5555-5555-5555-555555555555', 'AI & Pastis', 'Une comédie absurde sur une IA qui tente de comprendre l’art de vivre marseillais. Humour et satire.', 'France', 'Français', 'Animation', 2026, 89, '[\"Pika\", \"Suno\"]', '[\"Humanité & IA\", \"Liberté\"]', 'Musique : Suno.', 1, 'Camille Roux', 'camille.roux@example.com', '+33 6 01 02 03 04', '5 rue Sainte', '13001', 'Marseille', 'France', '1996-12-12', 'Étudiant·e', '{\"youtube\": \"https://youtube.com/@camille-ai\"}', 'Moteur de recherche', 'Camille Roux', 'camille.roux@example.com', 'https://picsum.photos/seed/marsai_s5/800/1200', 'https://example.com/videos/marsai_s5.mp4', NULL, NULL, NULL, 1, 1, 0, 1, 'selected', '2026-02-25 10:49:00'),
('58dc0ca4-b474-4da0-9226-ddc5668a3a50', 'dwwm\'s life', 'Sm', 'Autre', 'Autre', 'Autre', 2026, 62, '[\"Autre\"]', '[\"Futur souhaitable\", \"Écologie\", \"Humanité & IA\", \"Solidarité\", \"Espoir\", \"Résilience\", \"Utopie\", \"Nature\", \"Paix\", \"Innovation sociale\", \"Diversité\", \"Éducation\", \"Santé\", \"Liberté\", \"Mémoire\"]', 'Suno AI, etc.', 1, 's m', 'sm@sm.sm', '00 00 00 00 00', 'sm 001', '99xxx', 'Smtown', 'Autre', '1999-10-01', 'Autre', '{\"x\": \"sm\", \"tumblr\": \"sm\", \"youtube\": \"sm\", \"facebook\": \"sm\", \"linkedin\": \"sm\", \"instagram\": \"sm\"}', 'Autre', 'coucou', 'coucou@sm.sm', 'https://s3.fr-par.scw.cloud/tln/grp3/58dc0ca4-b474-4da0-9226-ddc5668a3a50/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/58dc0ca4-b474-4da0-9226-ddc5668a3a50/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/58dc0ca4-b474-4da0-9226-ddc5668a3a50/subtitles.mp4', 'rCHoOy77Qhk', 'rCHoOy77Qhk', 1, 1, 1, 1, 'selected', '2026-03-05 11:46:12'),
('66666666-6666-6666-6666-666666666666', 'École des Futurs', 'Dans une école publique augmentée, les élèves co-écrivent les cours avec une IA locale. L’éducation redevient une aventure.', 'Belgique', 'Français', 'Documentaire', 2026, 110, '[\"RunwayML\", \"DALL-E 3\"]', '[\"Éducation\", \"Innovation sociale\", \"Espoir\"]', 'Crédits musique : Udio + mixage humain.', 1, 'Sarah De Winter', 'sarah.dewinter@example.com', '+32 470 11 22 33', '1 rue des Arts', '1000', 'Bruxelles', 'Belgique', '1993-02-14', 'Réalisateur·rice', '{\"linkedin\": \"https://linkedin.com/in/sarahdewinter\"}', 'Newsletter', 'Sarah De Winter', 'sarah.dewinter@example.com', 'https://picsum.photos/seed/marsai_s6/800/1200', 'https://example.com/videos/marsai_s6.mp4', NULL, 'yt_private_s6', NULL, 1, 1, 0, 1, 'selected', '2026-02-26 10:49:00'),
('6c5a2358-7a82-48f2-acb4-861d286fe1fd', 'Heisenberg', 'Walter White se transforme en Heisenberg', 'France', 'Français', 'Fiction', 2026, 6, '[\"deevid\", \"grok\"]', '[\"Santé\"]', 'Musique générée par IA', 1, 'Pauline', 'Hiez', '0680330970', '3, boulevard d\'Estienne d\'Orves', '83200', 'Le Revest-les-eaux', 'France', '1992-01-28', 'Développeur·se', '{}', 'La Plateforme', 'Pauline', 'ok@gmail.com', 'https://s3.fr-par.scw.cloud/tln/grp3/6c5a2358-7a82-48f2-acb4-861d286fe1fd/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/6c5a2358-7a82-48f2-acb4-861d286fe1fd/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/6c5a2358-7a82-48f2-acb4-861d286fe1fd/subtitles.srt', 'B4lvob2KmhA', NULL, 1, 1, 1, 1, 'review', '2026-03-05 14:30:22'),
('6d95885f-7b69-4083-9fdd-3cf1e8e3f795', 'IA la révolution?', 'IA va t\'elle révolutionner nos vies', 'Angola', 'Amharique', 'Expérimental', 2026, 60, '[\"RunwayML\", \"Autre\"]', '[\"Humanité & IA\"]', 'youtube', 1, 'rose flamant', 'flamantrose@etmaison.fr', '06 78 90 87 60', '12 planete deconnecte', '87000', 'aurevoir', 'Andorre', '1962-03-11', 'Vidéaste', '{\"instagram\": \"flamantrose\"}', 'LinkedIn', 'flamant rose', 'flamantrose@etmaison.fr', 'https://s3.fr-par.scw.cloud/tln/grp3/6d95885f-7b69-4083-9fdd-3cf1e8e3f795/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/6d95885f-7b69-4083-9fdd-3cf1e8e3f795/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/6d95885f-7b69-4083-9fdd-3cf1e8e3f795/subtitles.vtt', 'tx38TsBxPik', NULL, 1, 1, 0, 1, 'pending', '2026-03-16 10:58:55'),
('77777777-7777-7777-7777-777777777777', 'Réparer la Ville', 'Des drones et des habitants réparent ensemble l’espace public grâce à une IA de coordination. La ville devient un commun.', 'Canada', 'Anglais', 'Fiction', 2026, 116, '[\"Sora\", \"Stable Diffusion\"]', '[\"Résilience\", \"Solidarité\", \"Nature\"]', 'Musique : MusicGen.', 1, 'Jordan Lee', 'jordan.lee@example.com', '+1 514 555 0123', '77 Rue Imaginaire', 'H2X 1Y4', 'Montréal', 'Canada', '1992-09-30', 'Photographe', '{\"instagram\": \"https://instagram.com/jordan.ai\"}', 'Twitter / X', 'Jordan Lee', 'jordan.lee@example.com', 'https://picsum.photos/seed/marsai_s7/800/1200', 'https://example.com/videos/marsai_s7.mp4', 'https://example.com/subtitles/marsai_s7.vtt', 'yt_private_s7', NULL, 1, 1, 0, 1, 'selected', '2026-02-27 10:49:00'),
('8624b443-7fe1-4100-80c1-ff1ce2ef4e71', 'Le monstre des mers', 'L\'histoire d\'un monstre marin', 'France', 'Français', 'Fiction', 2026, 10, '[\"deevid\"]', '[\"Nature\"]', 'Musique générée par IA', 1, 'Pauline', 'Hiez', '0680330970', '3, boulevard d\'Estienne d\'Orves', '83200', 'Le Revest-les-eaux', 'France', '1992-01-28', 'Développeur·se', '{}', 'La Plateforme', 'Pauline', 'ok@gmail.com', 'https://s3.fr-par.scw.cloud/tln/grp3/8624b443-7fe1-4100-80c1-ff1ce2ef4e71/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/8624b443-7fe1-4100-80c1-ff1ce2ef4e71/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/8624b443-7fe1-4100-80c1-ff1ce2ef4e71/subtitles.srt', 'XcPXoUiT-kg', NULL, 1, 1, 1, 1, 'selected', '2026-03-05 13:57:23'),
('88888888-8888-8888-8888-888888888888', 'Le Silence qui Soigne', 'Un film contemplatif où une IA compose des paysages sonores pour apaiser les villes. Une respiration collective.', 'Japon', 'Japonais', 'Poétique', 2026, 120, '[\"Luma AI\", \"MusicGen\"]', '[\"Santé\", \"Nature\", \"Paix\"]', 'Soundscape : MusicGen + mastering humain.', 1, 'Aiko Tanaka', 'aiko.tanaka@example.com', '+81 90 1234 5678', '1-2-3 Shibuya', '150-0002', 'Tokyo', 'Japon', '1995-04-01', 'Musicien·ne', '{\"youtube\": \"https://youtube.com/@aiko-ai\"}', 'Mobile Film Festival', 'Aiko Tanaka', 'aiko.tanaka@example.com', 'https://picsum.photos/seed/marsai_s8/800/1200', 'https://example.com/videos/marsai_s8.mp4', NULL, NULL, NULL, 1, 1, 0, 1, 'selected', '2026-02-28 10:49:00'),
('90df02a3-59d3-4eb1-9324-7519e4777152', 'Sunset', 'La plage au couché du soleil', 'France', 'Français', 'Contemplatif', 2026, 6, '[\"grok\"]', '[\"Nature\", \"Paix\"]', 'Musique générée par IA', 1, 'Laetitia', 'harmony83@orange.fr', '0680330970', '3, boulevard d\'Estiennes d\'Orves', '83200', 'Le Revest-les-eaux', 'France', '1992-01-28', 'Développeur·se', '{}', 'La Plateforme', 'Laetitia', 'harmony83@orange.fr', 'https://s3.fr-par.scw.cloud/tln/grp3/90df02a3-59d3-4eb1-9324-7519e4777152/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/90df02a3-59d3-4eb1-9324-7519e4777152/video.mp4', NULL, 'OFRn_T7pOcw', NULL, 1, 1, 1, 1, 'selected', '2026-03-06 10:33:10'),
('91fc2bd1-2169-45ca-b5b7-351c39468f18', 'Ia/humain le début d\'une romance', 'comment l\'ia est rentré dans notre vie quotidienne et prends de plus en plus de place bientot un partenaire?', 'Maroc', 'Arabe', 'Contemplatif', 2026, 80, '[\"MidJourney\", \"Synthesia\"]', '[\"Espoir\"]', 'test', 1, 'doly prane', 'e.dupasmahe@orange.fr', '06 78 95 64 32', '15 avenue maldetete', '54000', 'nancy', 'Italie', '1991-03-14', 'Musicien·ne', '{\"instagram\": \"doly\"}', 'Autre', 'doly prane', 'e.dupasmahe@orange.fr', 'https://s3.fr-par.scw.cloud/tln/grp3/91fc2bd1-2169-45ca-b5b7-351c39468f18/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/91fc2bd1-2169-45ca-b5b7-351c39468f18/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/91fc2bd1-2169-45ca-b5b7-351c39468f18/subtitles.txt', 'm5QseP9ZXS4', NULL, 1, 1, 0, 1, 'refused', '2026-03-05 14:40:01'),
('99999999-9999-9999-9999-999999999999', 'Marseille, Ville-Laboratoire', 'Une fiction courte où les décisions urbaines sont simulées par IA avant d’être votées en assemblée citoyenne.', 'France', 'Français', 'Fiction', 2026, 104, '[\"RunwayML\", \"ElevenLabs\"]', '[\"Liberté\", \"Innovation sociale\", \"Utopie\"]', 'Voix-off : ElevenLabs.', 1, 'Thomas Girard', 'thomas.girard@example.com', '+33 6 99 88 77 66', '9 rue de la République', '13002', 'Marseille', 'France', '1989-10-10', 'Réalisateur·rice', '{\"linkedin\": \"https://linkedin.com/in/thomasgirard\"}', 'La Plateforme', 'Thomas Girard', 'thomas.girard@example.com', 'https://picsum.photos/seed/marsai_s9/800/1200', 'https://example.com/videos/marsai_s9.mp4', NULL, 'yt_private_s9', NULL, 1, 1, 1, 1, 'selected', '2026-03-01 10:49:00'),
('a405cb0d-ec1e-4835-bd0b-d85184c2e90a', 'le robot maléfique', 'Un méchant robot va être arrêté par un gentil robot....', 'France', 'Français', 'Animation', 2026, 1, '[\"RunwayML\", \"Sora\"]', '[\"Futur souhaitable\"]', 'ajout du son avec sora', 1, 'Emmanuelle DUPAS-MAHE', 'emmanuelle.dupas-mahe@laplateforme.io', '+33664248214', '84 traverse des Roseaux', '83140', 'SIX-FOURS les PLAGES', 'France', '2001-09-06', 'Développeur·se', '{\"instagram\": \"daffyette7\"}', 'La Plateforme', 'Emmanuelle DUPAS-MAHE', 'emmanuelle.dupas-mahe@laplateforme.io', 'https://s3.fr-par.scw.cloud/tln/grp3/a405cb0d-ec1e-4835-bd0b-d85184c2e90a/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/a405cb0d-ec1e-4835-bd0b-d85184c2e90a/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/a405cb0d-ec1e-4835-bd0b-d85184c2e90a/subtitles.srt', NULL, NULL, 1, 1, 1, 1, 'selected', '2026-03-05 11:19:54'),
('a927ec86-0612-420a-9999-ede9751e1390', 'L\'Éveil des Sables', 'une immersion visuelle ou la nostalgie du cinéma classique rencontre la magie de la puissance de l\'intelligence artificielle', 'France', 'Français', 'Expérimental', 2026, 60, '[\"DALL-E 3\", \"Sora\"]', '[\"Humanité & IA\"]', 'musique généré par sora', 1, 'Laetitia Quintin', 'laetitia.quintin@laplateforme.io', '06 94 38 43 22', '10 rue de la lune', '13000', 'Marseille', 'France', '2006-06-08', 'Vidéaste', '{\"x\": \"harmony\", \"tumblr\": \"harmony\", \"youtube\": \"harmony\", \"facebook\": \"harmony\", \"linkedin\": \"harmony\", \"instagram\": \"harmony\"}', 'Bouche à oreille', 'jean érienafaire', 'jeanérienafaire@gmail.com', 'https://s3.fr-par.scw.cloud/tln/grp3/a927ec86-0612-420a-9999-ede9751e1390/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/a927ec86-0612-420a-9999-ede9751e1390/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/a927ec86-0612-420a-9999-ede9751e1390/subtitles.txt', NULL, NULL, 1, 1, 1, 1, 'selected', '2026-03-05 10:56:05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Récifs de Données', 'Dans un monde submergé, des récifs de données restaurent la biodiversité. Une fable sur nos traces numériques.', 'Portugal', 'Portugais', 'Expérimental', 2026, 117, '[\"DALL-E 3\", \"Runway Gen-3\"]', '[\"Écologie\", \"Mémoire\", \"Nature\"]', 'Musique : Udio.', 1, 'Miguel Sousa', 'miguel.sousa@example.com', '+351 91 234 5678', 'Rua Azul 12', '1100-000', 'Lisboa', 'Portugal', '1994-08-08', 'Designer', '{\"instagram\": \"https://instagram.com/miguel.ai\"}', 'Réseaux sociaux (Instagram, TikTok…)', 'Miguel Sousa', 'miguel.sousa@example.com', 'https://picsum.photos/seed/marsai_s10/800/1200', 'https://example.com/videos/marsai_s10.mp4', NULL, NULL, NULL, 1, 1, 0, 1, 'selected', '2026-03-02 10:49:00'),
('b0ebdf3c-498b-44c8-a3ff-281b83c72ec3', 'la puissance ia', 'la puissance de l\'ia au service de l\'humain', 'Canada', 'Italien', 'Expérimental', 2026, 60, '[\"MidJourney\", \"RunwayML\"]', '[\"Diversité\"]', 'test', 1, 'van du', 'vandu@gmail.com', '07 86 50 45 87', '12 avenue de la mafia', '13000', 'Marseille', 'Canada', '2007-05-10', 'Photographe', '{\"facebook\": \"van du\", \"instagram\": \"van du\"}', 'Presse / Médias', 'van du', 'vandu@gmail.com', 'https://s3.fr-par.scw.cloud/tln/grp3/b0ebdf3c-498b-44c8-a3ff-281b83c72ec3/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/b0ebdf3c-498b-44c8-a3ff-281b83c72ec3/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/b0ebdf3c-498b-44c8-a3ff-281b83c72ec3/subtitles.txt', 'ySTxSwd9MN0', NULL, 1, 1, 0, 1, 'selected', '2026-03-05 14:10:44'),
('b9e1b3e2-306c-4901-86d1-d91ee8400815', 'Star Wars', 'C\'est la guerre dans l\'espace', 'France', 'Français', 'Animation', 2026, 110, '[\"Pika\", \"Stable Diffusion\", \"Suno\"]', '[\"Futur souhaitable\", \"Espoir\"]', 'Musique générée par IA', 1, 'Pauline Hiez', 'pauline.hiez@laplateforme.io', '0680330970', '3, boulevard d\'Estienne d\'Orves', '83200', 'Le Revest-les-eaux', 'France', '1992-01-28', 'Développeur·se', '{}', 'La Plateforme', 'Pauline', 'ok@gmail.fr', 'https://s3.fr-par.scw.cloud/tln/grp3/b9e1b3e2-306c-4901-86d1-d91ee8400815/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/b9e1b3e2-306c-4901-86d1-d91ee8400815/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/b9e1b3e2-306c-4901-86d1-d91ee8400815/subtitles.srt', NULL, NULL, 1, 1, 1, 1, 'selected', '2026-03-05 11:38:32'),
('f0062175-9023-457b-9a5b-d41894e7ba15', 'Nature sauvage', 'Le fleuve l\'Oïde coule à nouveau !', 'France', 'Français', 'Documentaire', 2026, 15, '[\"MidJourney\", \"Sora\"]', '[\"Écologie\"]', 'sora avec le son', 1, 'Emmanuelle DUPAS-MAHE', 'emmanuelle.dupas-mahe@laplateforme.io', '+33664248214', '84 traverse des Roseaux', '83140', 'SIX-FOURS les PLAGES', 'France', '1964-09-14', 'Designer', '{\"instagram\": \"daffyette7\"}', 'Bouche à oreille', 'Emmanuelle DUPAS-MAHE', 'emmanuelle.dupas-mahe@laplateforme.io', 'https://s3.fr-par.scw.cloud/tln/grp3/f0062175-9023-457b-9a5b-d41894e7ba15/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/f0062175-9023-457b-9a5b-d41894e7ba15/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/f0062175-9023-457b-9a5b-d41894e7ba15/subtitles.srt', 'wZG-lAoRhL0', NULL, 1, 1, 1, 1, 'selected', '2026-03-05 14:17:28'),
('f54ffe52-8643-4cbb-8d8c-cc4f083d4e36', 'Le monstre', 'Le monstre attaque', 'France', 'Français', 'Poétique', 2026, 6, '[\"grok\"]', '[\"Écologie\"]', 'Musique générée par IA', 1, 'Pauline Hiez', 'pauline.hiez@laplateforme.io', '0680330970', '3, boulevard d\'Estienne d\'Orves', '83200', 'Le Revest-les-eaux', 'France', '1992-01-28', 'Développeur·se', '{}', 'La Plateforme', 'Pauline', 'test@gmail.fr', 'https://s3.fr-par.scw.cloud/tln/grp3/f54ffe52-8643-4cbb-8d8c-cc4f083d4e36/poster.png', 'https://s3.fr-par.scw.cloud/tln/grp3/f54ffe52-8643-4cbb-8d8c-cc4f083d4e36/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/f54ffe52-8643-4cbb-8d8c-cc4f083d4e36/subtitles.srt', 'QYbL3xneXYA', 'QYbL3xneXYA', 1, 1, 1, 1, 'selected', '2026-03-05 14:41:47'),
('fa8a2f29-da34-461a-902b-0f19446d3550', 'notre allié l\'IA', 'comment l\'Ia peut nous faciliter la vie', 'Italie', 'Coréen', 'Animation', 2026, 90, '[\"RunwayML\", \"Stable Diffusion\"]', '[\"Futur souhaitable\"]', 'test', 1, 'alan bic', 'alanbic@gmail.com', '06 78 52 13 45', '45 rue de l\'ivresse', '83000', 'Toulon', 'Argentine', '1986-08-21', 'Designer', '{}', 'Bouche à oreille', 'alan bic', 'alanbic@gmail.com', 'https://s3.fr-par.scw.cloud/tln/grp3/fa8a2f29-da34-461a-902b-0f19446d3550/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/fa8a2f29-da34-461a-902b-0f19446d3550/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/fa8a2f29-da34-461a-902b-0f19446d3550/subtitles.txt', 'V6-oYJXrBPM', NULL, 1, 1, 0, 1, 'selected', '2026-03-05 14:22:24'),
('fd922ed3-d900-43eb-a1f0-8adafcb682a4', 'évolution', 'Une immersion visuelle où la nostalgie du cinéma classique rencontre la puissance de l\'intelligence artificielle', 'Maroc', 'Mandarin', 'Autre', 2026, 60, '[\"MidJourney\", \"Kling\"]', '[\"Humanité & IA\"]', 'test', 1, 'jean bon', 'jeanbon@gmail.com', '06 78 90 65 34', '\'( rue de la ferme', '89765', 'trouville', 'Espagne', '2005-12-16', 'Artiste numérique', '{\"youtube\": \"jeanbon\", \"instagram\": \"jeanbon\"}', 'Moteur de recherche', 'jean bon', 'jeanbon@gmail.com', 'https://s3.fr-par.scw.cloud/tln/grp3/fd922ed3-d900-43eb-a1f0-8adafcb682a4/poster.jpg', 'https://s3.fr-par.scw.cloud/tln/grp3/fd922ed3-d900-43eb-a1f0-8adafcb682a4/video.mp4', 'https://s3.fr-par.scw.cloud/tln/grp3/fd922ed3-d900-43eb-a1f0-8adafcb682a4/subtitles.txt', '1Drr4bqct_E', NULL, 1, 1, 0, 1, 'selected', '2026-03-05 14:00:07');

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
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `google_sub_id`, `email`, `name`, `role`, `created_at`) VALUES
(1, '112151256173848105745', 'pascal.fortunati@laplateforme.io', 'Pascal Fortunati', 'jury', '2026-03-05 09:11:13'),
(2, '110369763757146397586', 'twwf83@gmail.com', 'Zeigadis', 'admin', '2026-03-05 09:11:13'),
(33, '107120282939411362001', 'pauline.hiez@laplateforme.io', 'Pauline Hiez', 'moderator', '2026-03-06 09:35:03'),
(34, '106063734848103743924', 'sylvain.malbon@laplateforme.io', 'Sylvain Malbon', 'jury', '2026-03-06 09:39:42'),
(35, '111083311227528118774', 'laetitia.quintin@laplateforme.io', 'Laetitia Quintin', 'jury', '2026-03-06 09:40:38'),
(36, NULL, 'emmanuelle.dupas-mahe@laplateforme.io', 'Emmanuelle Dupas-Mahé', 'jury', '2026-03-06 16:05:02'),
(37, '114534791983987304481', 'franck.fortunati@laplateforme.io', 'Franck Fortunati', 'moderator', '2026-03-09 12:32:12');

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `jury_assignments`
--
ALTER TABLE `jury_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `jury_votes`
--
ALTER TABLE `jury_votes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
