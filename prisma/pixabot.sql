-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pixabot
CREATE DATABASE IF NOT EXISTS `pixabot` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pixabot`;

-- Dumping structure for table pixabot.account
CREATE TABLE IF NOT EXISTS `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerAccountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `access_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` int DEFAULT NULL,
  `token_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  KEY `Account_userId_fkey` (`userId`),
  CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.account: ~0 rows (approximately)
INSERT INTO `account` (`id`, `userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`) VALUES
	(1, 3, 'credentials', 'credentials', 'admin@seed.pixabot.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(2, 4, 'credentials', 'credentials', 'pro@seed.pixabot.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(3, 5, 'credentials', 'credentials', 'free@seed.pixabot.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- Dumping structure for table pixabot.apikey
CREATE TABLE IF NOT EXISTS `apikey` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastUsedAt` datetime(3) DEFAULT NULL,
  `revokedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ApiKey_keyHash_key` (`keyHash`),
  UNIQUE KEY `ApiKey_userId_name_key` (`userId`,`name`),
  KEY `ApiKey_userId_createdAt_idx` (`userId`,`createdAt`),
  CONSTRAINT `ApiKey_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.apikey: ~0 rows (approximately)
INSERT INTO `apikey` (`id`, `userId`, `name`, `prefix`, `keyHash`, `lastUsedAt`, `revokedAt`, `createdAt`) VALUES
	(1, 3, 'Default (admin)', 'sk-...5863', '841e2f2e9900091488ccdf97c26d8ba32f002cfaba425b9974fdf03ed79c543c', NULL, NULL, '2026-01-25 09:59:09.127'),
	(2, 3, 'CI (admin)', 'sk-...e142', '4eafc5d76fd6973751c803484c6c18231e93a7faa850df74abd6b278feb74c90', NULL, NULL, '2026-01-25 09:59:09.132'),
	(3, 4, 'Default (pro)', 'sk-...1885', '3fac85432702ec35186592ccded639cee641ea79e87da5fb671f24c3b664d0c0', NULL, NULL, '2026-01-25 09:59:09.263'),
	(4, 4, 'CI (pro)', 'sk-...5d7a', '7f850ecb860b8118246a9576dc113b116496a3f4155e7fe33339ff53a293e2a6', NULL, NULL, '2026-01-25 09:59:09.267'),
	(5, 5, 'Default (user)', 'sk-...58f6', 'b8b82c8523acd242f2d27379ff637d40c4637b82d036f16ed9b608664e5a5856', NULL, NULL, '2026-01-25 09:59:09.390'),
	(6, 5, 'CI (user)', 'sk-...906f', 'e589cc171f3ddc1ab8bbf31c1149484e2794ab23aecb5b47684328b6b9aa2ee4', NULL, NULL, '2026-01-25 09:59:09.392');

-- Dumping structure for table pixabot.chatmessage
CREATE TABLE IF NOT EXISTS `chatmessage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `threadId` int NOT NULL,
  `role` enum('user','assistant','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tokens` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ChatMessage_threadId_createdAt_idx` (`threadId`,`createdAt`),
  CONSTRAINT `ChatMessage_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `chatthread` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.chatmessage: ~0 rows (approximately)
INSERT INTO `chatmessage` (`id`, `threadId`, `role`, `content`, `imageUrl`, `tokens`, `createdAt`) VALUES
	(1, 1, 'user', 'Halo, ini pesan seed.', NULL, 10, '2026-01-25 09:59:09.139'),
	(2, 1, 'assistant', 'Halo! Ini balasan seed.', NULL, 0, '2026-01-25 09:59:09.139'),
	(3, 2, 'user', 'Halo, ini pesan seed.', NULL, 10, '2026-01-25 09:59:09.271'),
	(4, 2, 'assistant', 'Halo! Ini balasan seed.', NULL, 0, '2026-01-25 09:59:09.271'),
	(5, 3, 'user', 'Halo, ini pesan seed.', NULL, 0, '2026-01-25 09:59:09.397'),
	(6, 3, 'assistant', 'Halo! Ini balasan seed.', NULL, 0, '2026-01-25 09:59:09.397');

-- Dumping structure for table pixabot.chatthread
CREATE TABLE IF NOT EXISTS `chatthread` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ChatThread_userId_updatedAt_idx` (`userId`,`updatedAt`),
  CONSTRAINT `ChatThread_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.chatthread: ~0 rows (approximately)
INSERT INTO `chatthread` (`id`, `userId`, `title`, `createdAt`, `updatedAt`) VALUES
	(1, 3, 'Seed thread', '2026-01-25 09:59:09.136', '2026-01-25 09:59:09.136'),
	(2, 4, 'Seed thread', '2026-01-25 09:59:09.270', '2026-01-25 09:59:09.270'),
	(3, 5, 'Seed thread', '2026-01-25 09:59:09.396', '2026-01-25 09:59:09.396');

-- Dumping structure for table pixabot.imagegeneration
CREATE TABLE IF NOT EXISTS `imagegeneration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `prompt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokens` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ImageGeneration_userId_createdAt_idx` (`userId`,`createdAt`),
  CONSTRAINT `ImageGeneration_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.imagegeneration: ~0 rows (approximately)
INSERT INTO `imagegeneration` (`id`, `userId`, `prompt`, `imageUrl`, `tokens`, `createdAt`, `metadata`) VALUES
	(1, 3, 'spongebob', 'https://image.pollinations.ai/prompt/spongebob', 40, '2026-01-25 09:59:09.144', '{"source": "seed"}'),
	(2, 4, 'spongebob', 'https://image.pollinations.ai/prompt/spongebob', 40, '2026-01-25 09:59:09.274', '{"source": "seed"}'),
	(3, 5, 'spongebob', 'https://image.pollinations.ai/prompt/spongebob', 0, '2026-01-25 09:59:09.400', '{"source": "seed"}');

-- Dumping structure for table pixabot.invoice
CREATE TABLE IF NOT EXISTS `invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('draft','pending','paid','void') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `amountCents` int NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `pdfUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `paidAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Invoice_number_key` (`number`),
  KEY `Invoice_userId_issuedAt_idx` (`userId`,`issuedAt`),
  CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.invoice: ~3 rows (approximately)
INSERT INTO `invoice` (`id`, `userId`, `number`, `status`, `amountCents`, `currency`, `pdfUrl`, `issuedAt`, `paidAt`, `createdAt`) VALUES
	(1, 2, 'INV-20260125-MKTHCG1I-SXZ2NT79', 'pending', 7000, 'USD', NULL, '2026-01-25 08:31:50.087', NULL, '2026-01-25 08:31:50.087'),
	(2, 2, 'INV-20260125-MKTHCMDY-KRS3V5ZK', 'pending', 7000, 'USD', NULL, '2026-01-25 08:31:58.301', NULL, '2026-01-25 08:31:58.301'),
	(3, 2, 'INV-20260125-MKTHCOCG-G565G0KG', 'paid', 7000, 'USD', NULL, '2026-01-25 08:32:00.839', '2026-01-25 08:32:03.990', '2026-01-25 08:32:00.839'),
	(4, 3, 'INV-SEED-3-f9056c', 'paid', 2500, 'USD', NULL, '2026-01-15 09:59:09.094', '2026-01-16 09:59:09.094', '2026-01-25 09:59:09.097'),
	(5, 3, 'INV-SEED-PENDING-3-28e5de', 'pending', 500, 'USD', NULL, '2026-01-24 09:59:09.105', NULL, '2026-01-25 09:59:09.107'),
	(6, 4, 'INV-SEED-4-d322c6', 'paid', 2500, 'USD', NULL, '2026-01-15 09:59:09.240', '2026-01-16 09:59:09.240', '2026-01-25 09:59:09.242'),
	(7, 4, 'INV-SEED-PENDING-4-9282ae', 'pending', 500, 'USD', NULL, '2026-01-24 09:59:09.248', NULL, '2026-01-25 09:59:09.249'),
	(8, 5, 'INV-SEED-5-018981', 'paid', 2500, 'USD', NULL, '2026-01-15 09:59:09.366', '2026-01-16 09:59:09.366', '2026-01-25 09:59:09.368'),
	(9, 5, 'INV-SEED-PENDING-5-02f3bc', 'pending', 500, 'USD', NULL, '2026-01-24 09:59:09.374', NULL, '2026-01-25 09:59:09.376'),
	(10, 4, 'INV-20260125-MKTN46SM-1JVPXRT2', 'paid', 500, 'USD', NULL, '2026-01-25 11:13:22.540', '2026-01-25 11:13:33.651', '2026-01-25 11:13:22.540');

-- Dumping structure for table pixabot.payment
CREATE TABLE IF NOT EXISTS `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `invoiceId` int DEFAULT NULL,
  `methodId` int DEFAULT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `providerRef` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','succeeded','failed','canceled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `amountCents` int NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Payment_userId_createdAt_idx` (`userId`,`createdAt`),
  KEY `Payment_status_createdAt_idx` (`status`,`createdAt`),
  KEY `Payment_invoiceId_fkey` (`invoiceId`),
  KEY `Payment_methodId_fkey` (`methodId`),
  CONSTRAINT `Payment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Payment_methodId_fkey` FOREIGN KEY (`methodId`) REFERENCES `paymentmethod` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.payment: ~3 rows (approximately)
INSERT INTO `payment` (`id`, `userId`, `invoiceId`, `methodId`, `provider`, `providerRef`, `status`, `amountCents`, `currency`, `createdAt`, `updatedAt`) VALUES
	(1, 2, 1, NULL, 'card', 'pkg:3:mkthcg1i-b6fswfeq', 'pending', 7000, 'USD', '2026-01-25 08:31:50.095', '2026-01-25 08:31:50.095'),
	(2, 2, 2, NULL, 'quick', 'pkg:3:mkthcmdy-9z2xllmv', 'pending', 7000, 'USD', '2026-01-25 08:31:58.306', '2026-01-25 08:31:58.306'),
	(3, 2, 3, NULL, 'bank', 'pkg:3:mkthcocg-gve4p1vr', 'succeeded', 7000, 'USD', '2026-01-25 08:32:00.843', '2026-01-25 08:32:03.990'),
	(4, 3, 4, 2, 'card', 'pay:mktkgqi4:6cab5732ecb2', 'succeeded', 2500, 'USD', '2026-01-15 09:59:09.100', '2026-01-16 09:59:09.100'),
	(5, 3, 5, 2, 'card', 'pay:mktkgqic:00c7bc5acbbc', 'pending', 500, 'USD', '2026-01-24 09:59:09.108', '2026-01-25 09:59:09.110'),
	(6, 4, 6, NULL, 'card', 'pay:mktkgqm4:93868f4ad20b', 'succeeded', 2500, 'USD', '2026-01-15 09:59:09.244', '2026-01-16 09:59:09.244'),
	(8, 5, 8, 6, 'card', 'pay:mktkgqpm:01da7c2f8ea4', 'succeeded', 2500, 'USD', '2026-01-15 09:59:09.370', '2026-01-16 09:59:09.370'),
	(9, 5, 9, 6, 'card', 'pay:mktkgqpu:2fcc0d98f2ec', 'pending', 500, 'USD', '2026-01-24 09:59:09.378', '2026-01-25 09:59:09.380'),
	(10, 4, 10, 8, 'card', 'pkg:1:mktn46sm-b3sly072', 'succeeded', 500, 'USD', '2026-01-25 11:13:22.551', '2026-01-25 11:13:33.651');

-- Dumping structure for table pixabot.paymentmethod
CREATE TABLE IF NOT EXISTS `paymentmethod` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last4` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `providerMethodId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `PaymentMethod_userId_createdAt_idx` (`userId`,`createdAt`),
  CONSTRAINT `PaymentMethod_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.paymentmethod: ~1 rows (approximately)
INSERT INTO `paymentmethod` (`id`, `userId`, `label`, `type`, `last4`, `isPrimary`, `provider`, `providerMethodId`, `status`, `createdAt`) VALUES
	(1, 2, 'Rievan Averillio **** 8094', 'card', '8094', 1, 'card', NULL, 'active', '2026-01-25 09:15:23.230'),
	(2, 3, 'Seed Admin Visa **** 4242', 'card', '4242', 1, 'card', 'pm:mktkgqhr:3794e1a135d8', 'active', '2026-01-25 09:59:09.089'),
	(3, 3, 'Seed Admin PayPal', 'paypal', NULL, 0, 'paypal', 'pm:mktkgqhu:a6cef3bcba9c', 'active', '2026-01-25 09:59:09.092'),
	(6, 5, 'Seed Free Visa **** 4242', 'card', '4242', 1, 'card', 'pm:mktkgqpa:ed40615d4651', 'active', '2026-01-25 09:59:09.360'),
	(7, 5, 'Seed Free PayPal', 'paypal', NULL, 0, 'paypal', 'pm:mktkgqpe:b546b143359c', 'active', '2026-01-25 09:59:09.364'),
	(8, 4, 'Pro PayPal **** 3242', 'card', '3242', 0, 'card', NULL, 'active', '2026-01-25 11:03:25.731'),
	(9, 4, 'Pro Gopay **** 7239', 'card', '7239', 1, 'card', NULL, 'active', '2026-01-25 11:04:07.085');

-- Dumping structure for table pixabot.tokentransaction
CREATE TABLE IF NOT EXISTS `tokentransaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `type` enum('topup','purchase','usage','refund','adjustment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `TokenTransaction_userId_createdAt_idx` (`userId`,`createdAt`),
  CONSTRAINT `TokenTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.tokentransaction: ~23 rows (approximately)
INSERT INTO `tokentransaction` (`id`, `userId`, `type`, `amount`, `note`, `metadata`, `createdAt`) VALUES
	(1, 2, 'topup', 10000, 'Top-up Business', '{"role": "business", "packageId": 3}', '2026-01-25 08:32:04.017'),
	(2, 2, 'usage', -10, 'PixaChat message', '{"kind": "chat"}', '2026-01-25 08:34:58.531'),
	(3, 2, 'usage', -10, 'PixaChat message', '{"kind": "chat"}', '2026-01-25 08:35:04.965'),
	(4, 2, 'usage', -10, 'PixaChat message', '{"kind": "chat"}', '2026-01-25 08:36:17.293'),
	(5, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 12}', '2026-01-25 09:11:18.262'),
	(6, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 14}', '2026-01-25 09:11:30.703'),
	(7, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:11:59.256'),
	(8, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:16:56.093'),
	(9, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:36:42.226'),
	(10, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:37:02.442'),
	(11, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:37:11.303'),
	(12, 2, 'usage', -10, 'PixaChat message', '{"kind": "chat"}', '2026-01-25 09:37:25.311'),
	(13, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:37:31.402'),
	(14, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:41:27.494'),
	(15, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:42:44.963'),
	(16, 2, 'usage', -10, 'PixaChat message', '{"kind": "chat"}', '2026-01-25 09:43:08.424'),
	(17, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:43:18.447'),
	(18, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 09:46:11.121'),
	(19, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 14}', '2026-01-25 09:47:41.289'),
	(20, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 15}', '2026-01-25 09:50:12.440'),
	(21, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 19}', '2026-01-25 09:51:45.809'),
	(22, 2, 'usage', -10, 'PixaChat message', '{"kind": "chat"}', '2026-01-25 09:52:20.628'),
	(23, 2, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 17}', '2026-01-25 09:53:03.701'),
	(24, 3, 'topup', 3000, 'Seed topup', '{"source": "seed"}', '2026-01-15 09:59:09.112'),
	(25, 3, 'usage', -10, 'Seed chat usage', '{"kind": "chat"}', '2026-01-25 09:59:09.112'),
	(26, 3, 'usage', -40, 'Seed image usage', '{"kind": "image"}', '2026-01-25 09:59:09.112'),
	(27, 4, 'topup', 3000, 'Seed topup', '{"source": "seed"}', '2026-01-15 09:59:09.255'),
	(28, 4, 'usage', -10, 'Seed chat usage', '{"kind": "chat"}', '2026-01-25 09:59:09.255'),
	(29, 4, 'usage', -40, 'Seed image usage', '{"kind": "image"}', '2026-01-25 09:59:09.255'),
	(30, 5, 'topup', 3000, 'Seed topup', '{"source": "seed"}', '2026-01-15 09:59:09.382'),
	(31, 5, 'usage', -10, 'Seed chat usage', '{"kind": "chat"}', '2026-01-25 09:59:09.382'),
	(32, 5, 'usage', -40, 'Seed image usage', '{"kind": "image"}', '2026-01-25 09:59:09.382'),
	(33, 4, 'usage', -10, 'PixaChat message', '{"kind": "chat"}', '2026-01-25 10:26:39.884'),
	(34, 4, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 9}', '2026-01-25 10:51:41.087'),
	(35, 4, 'usage', -40, 'Image generation', '{"kind": "image", "promptLength": 14}', '2026-01-25 10:56:42.352'),
	(36, 4, 'topup', 500, 'Top-up Starter', '{"role": "starter", "packageId": 1}', '2026-01-25 11:13:33.674');

-- Dumping structure for table pixabot.tokenwallet
CREATE TABLE IF NOT EXISTS `tokenwallet` (
  `userId` int NOT NULL,
  `balance` int NOT NULL DEFAULT '0',
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`userId`),
  CONSTRAINT `TokenWallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.tokenwallet: ~1 rows (approximately)
INSERT INTO `tokenwallet` (`userId`, `balance`, `updatedAt`) VALUES
	(2, 9300, '2026-01-25 09:53:03.707'),
	(3, 999999, '2026-01-25 09:59:09.078'),
	(4, 2910, '2026-01-25 11:13:33.666'),
	(5, 0, '2026-01-25 09:59:09.352');

-- Dumping structure for table pixabot.usageevent
CREATE TABLE IF NOT EXISTS `usageevent` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `kind` enum('chat','image','api') COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tokens` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UsageEvent_userId_createdAt_idx` (`userId`,`createdAt`),
  KEY `UsageEvent_kind_createdAt_idx` (`kind`,`createdAt`),
  CONSTRAINT `UsageEvent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.usageevent: ~22 rows (approximately)
INSERT INTO `usageevent` (`id`, `userId`, `kind`, `action`, `tokens`, `createdAt`, `metadata`) VALUES
	(1, 2, 'chat', 'message', 10, '2026-01-25 08:34:58.531', '{"tokenCost": 10}'),
	(2, 2, 'chat', 'message', 10, '2026-01-25 08:35:04.965', '{"tokenCost": 10}'),
	(3, 2, 'chat', 'message', 10, '2026-01-25 08:36:17.293', '{"tokenCost": 10}'),
	(4, 2, 'image', 'generate', 40, '2026-01-25 09:11:18.262', '{"promptLength": 12}'),
	(5, 2, 'image', 'generate', 40, '2026-01-25 09:11:30.703', '{"promptLength": 14}'),
	(6, 2, 'image', 'generate', 40, '2026-01-25 09:11:59.256', '{"promptLength": 9}'),
	(7, 2, 'image', 'generate', 40, '2026-01-25 09:16:56.093', '{"promptLength": 9}'),
	(8, 2, 'image', 'generate', 40, '2026-01-25 09:36:42.226', '{"promptLength": 9}'),
	(9, 2, 'image', 'generate', 40, '2026-01-25 09:37:02.442', '{"promptLength": 9}'),
	(10, 2, 'image', 'generate', 40, '2026-01-25 09:37:11.303', '{"promptLength": 9}'),
	(11, 2, 'chat', 'message', 10, '2026-01-25 09:37:25.311', '{"tokenCost": 10}'),
	(12, 2, 'image', 'generate', 40, '2026-01-25 09:37:31.402', '{"promptLength": 9}'),
	(13, 2, 'image', 'generate', 40, '2026-01-25 09:41:27.494', '{"promptLength": 9}'),
	(14, 2, 'image', 'generate', 40, '2026-01-25 09:42:44.963', '{"promptLength": 9}'),
	(15, 2, 'chat', 'message', 10, '2026-01-25 09:43:08.424', '{"tokenCost": 10}'),
	(16, 2, 'image', 'generate', 40, '2026-01-25 09:43:18.447', '{"promptLength": 9}'),
	(17, 2, 'image', 'generate', 40, '2026-01-25 09:46:11.121', '{"promptLength": 9}'),
	(18, 2, 'image', 'generate', 40, '2026-01-25 09:47:41.289', '{"promptLength": 14}'),
	(19, 2, 'image', 'generate', 40, '2026-01-25 09:50:12.440', '{"promptLength": 15}'),
	(20, 2, 'image', 'generate', 40, '2026-01-25 09:51:45.809', '{"promptLength": 19}'),
	(21, 2, 'chat', 'message', 10, '2026-01-25 09:52:20.628', '{"tokenCost": 10}'),
	(22, 2, 'image', 'generate', 40, '2026-01-25 09:53:03.701', '{"promptLength": 17}'),
	(23, 3, 'chat', 'message', 10, '2026-01-25 09:59:09.119', '{"source": "seed", "dayOffset": 0}'),
	(24, 3, 'chat', 'message', 10, '2026-01-24 09:59:09.120', '{"source": "seed", "dayOffset": 1}'),
	(25, 3, 'chat', 'message', 10, '2026-01-23 09:59:09.120', '{"source": "seed", "dayOffset": 2}'),
	(26, 3, 'chat', 'message', 10, '2026-01-22 09:59:09.120', '{"source": "seed", "dayOffset": 3}'),
	(27, 3, 'chat', 'message', 10, '2026-01-21 09:59:09.120', '{"source": "seed", "dayOffset": 4}'),
	(28, 3, 'chat', 'message', 10, '2026-01-20 09:59:09.120', '{"source": "seed", "dayOffset": 5}'),
	(29, 3, 'chat', 'message', 10, '2026-01-19 09:59:09.120', '{"source": "seed", "dayOffset": 6}'),
	(30, 3, 'image', 'generate', 40, '2026-01-25 09:59:09.120', '{"prompt": "spongebob", "source": "seed"}'),
	(31, 4, 'chat', 'message', 10, '2026-01-25 09:59:09.258', '{"source": "seed", "dayOffset": 0}'),
	(32, 4, 'chat', 'message', 10, '2026-01-24 09:59:09.258', '{"source": "seed", "dayOffset": 1}'),
	(33, 4, 'chat', 'message', 10, '2026-01-23 09:59:09.258', '{"source": "seed", "dayOffset": 2}'),
	(34, 4, 'chat', 'message', 10, '2026-01-22 09:59:09.258', '{"source": "seed", "dayOffset": 3}'),
	(35, 4, 'chat', 'message', 10, '2026-01-21 09:59:09.258', '{"source": "seed", "dayOffset": 4}'),
	(36, 4, 'chat', 'message', 10, '2026-01-20 09:59:09.258', '{"source": "seed", "dayOffset": 5}'),
	(37, 4, 'chat', 'message', 10, '2026-01-19 09:59:09.258', '{"source": "seed", "dayOffset": 6}'),
	(38, 4, 'image', 'generate', 40, '2026-01-25 09:59:09.258', '{"prompt": "spongebob", "source": "seed"}'),
	(39, 5, 'chat', 'message', 0, '2026-01-25 09:59:09.385', '{"source": "seed", "dayOffset": 0}'),
	(40, 5, 'chat', 'message', 0, '2026-01-24 09:59:09.385', '{"source": "seed", "dayOffset": 1}'),
	(41, 5, 'chat', 'message', 0, '2026-01-23 09:59:09.385', '{"source": "seed", "dayOffset": 2}'),
	(42, 5, 'chat', 'message', 0, '2026-01-22 09:59:09.385', '{"source": "seed", "dayOffset": 3}'),
	(43, 5, 'chat', 'message', 0, '2026-01-21 09:59:09.385', '{"source": "seed", "dayOffset": 4}'),
	(44, 5, 'chat', 'message', 0, '2026-01-20 09:59:09.385', '{"source": "seed", "dayOffset": 5}'),
	(45, 5, 'chat', 'message', 0, '2026-01-19 09:59:09.385', '{"source": "seed", "dayOffset": 6}'),
	(46, 5, 'image', 'generate', 0, '2026-01-25 09:59:09.385', '{"prompt": "spongebob", "source": "seed"}'),
	(47, 4, 'chat', 'message', 10, '2026-01-25 10:26:39.884', '{"tokenCost": 10}'),
	(48, 4, 'image', 'generate', 40, '2026-01-25 10:51:41.087', '{"promptLength": 9}'),
	(49, 4, 'image', 'generate', 40, '2026-01-25 10:56:42.352', '{"promptLength": 14}');

-- Dumping structure for table pixabot.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.user: ~1 rows (approximately)
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `password`, `role`, `createdAt`, `updatedAt`, `image`) VALUES
	(1, 'Rievan Averillio', 'averillio.rievan@gmail.com', NULL, '$2b$10$I6OQKlnGhAcivCT08agNwOzjgVhQ0yUL05wavP5HUdKCFTyk0Nfg6', 'user', '2026-01-14 13:33:07.382', '2026-01-14 14:13:54.100', NULL),
	(2, 'Rievan Averillio Fadhlan', 'rievan@gmail.com', NULL, '$2b$10$8hQsfK39mgL3Xsac7PgcxODuTCfWzA3AZFaSPaoJ.A4O2W4cIs/9C', 'business', '2026-01-25 08:07:47.367', '2026-01-25 08:32:04.024', NULL),
	(3, 'Seed Admin', 'admin@seed.pixabot.local', NULL, '$2b$10$PG99iJ.bMWlkBkH537otou7YQuM2SjoyiMiClcNb.lnTwI4/256YW', 'admin', '2026-01-25 09:59:09.069', '2026-01-25 09:59:09.069', NULL),
	(4, 'Seed Pro', 'pro@seed.pixabot.local', NULL, '$2b$10$2pC9oLWzz2VOKl.1Ox.ga.iCJbuiQN6pSe1aWA/CjW.vqo./.G9Ye', 'pro', '2026-01-25 09:59:09.218', '2026-01-25 09:59:09.218', NULL),
	(5, 'Seed Free', 'free@seed.pixabot.local', NULL, '$2b$10$PtO.KRg6324l1.wN.AvjN.MQC87UCb7MUt6BeE1g2cC0qVLSDkReG', 'user', '2026-01-25 09:59:09.344', '2026-01-25 09:59:09.344', NULL);

-- Dumping structure for table pixabot.usersettings
CREATE TABLE IF NOT EXISTS `usersettings` (
  `userId` int NOT NULL,
  `twoFaEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `notificationsEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `language` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`userId`),
  CONSTRAINT `UserSettings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot.usersettings: ~1 rows (approximately)
INSERT INTO `usersettings` (`userId`, `twoFaEnabled`, `notificationsEnabled`, `language`, `timezone`, `updatedAt`) VALUES
	(1, 0, 0, 'ID', 'Jakarta', '2026-01-14 14:13:54.100'),
	(2, 0, 1, '', '', '2026-01-25 08:09:03.096'),
	(3, 0, 1, 'id', 'Asia/Jakarta', '2026-01-25 09:59:09.074'),
	(4, 0, 1, 'id', 'Asia/Jakarta', '2026-01-25 09:59:09.223'),
	(5, 0, 1, 'id', 'Asia/Jakarta', '2026-01-25 09:59:09.349');

-- Dumping structure for table pixabot._prisma_migrations
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pixabot._prisma_migrations: ~0 rows (approximately)
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('762a919d-9714-455a-83c4-48dfad6a2090', 'f5a4a78b636b13d1044b4d91903eac2c22155a2da1e160556d57f5619bdf6959', '2026-01-14 13:29:41.359', '20260114130622_trim_auth_jwt', NULL, NULL, '2026-01-14 13:29:41.334', 1),
	('b106d86a-e405-4cf3-b63e-e787b9c60a9a', 'e7153842c0bfcebb3b3f91821572172555f5de5614e22974d29035a2428e7692', '2026-01-14 13:29:40.431', '20260114102948_init', NULL, NULL, '2026-01-14 13:29:40.242', 1),
	('c949677c-d02e-4485-8bea-fb43ea8aecf7', '50047ad3e2b320a41fc6fd02da884fd9318f4520d3efe4ec12b73ac7eb50bc86', '2026-01-14 13:29:40.452', '20260114113110_add_user_image', NULL, NULL, '2026-01-14 13:29:40.434', 1),
	('e9daa9d6-89f6-4640-8015-0db7bf026af6', '49b40deb202f05bc65540724d66cac83d8e80e7f54209dfd040eac15c2dca2f1', '2026-01-14 13:29:41.332', '20260114123928_dashboard_models', NULL, NULL, '2026-01-14 13:29:40.454', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
