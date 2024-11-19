-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2024 at 04:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mathattack`
--

-- --------------------------------------------------------

--
-- Table structure for table `daily_bank`
--

CREATE TABLE `daily_bank` (
  `question` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_bank`
--

INSERT INTO `daily_bank` (`question`) VALUES
('123+93*2'),
('600/120-23+453'),
('64+120-294/3'),
('68/4+212'),
('84-12*3-26');

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard_addition`
--

CREATE TABLE `leaderboard_addition` (
  `user` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  `time` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard_challenge`
--

CREATE TABLE `leaderboard_challenge` (
  `user` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  `time` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard_daily`
--

CREATE TABLE `leaderboard_daily` (
  `user` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  `time` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaderboard_daily`
--

INSERT INTO `leaderboard_daily` (`user`, `score`, `time`) VALUES
('googeyser', 5, '2:12'),
('saarah12', 3, '1:58'),
('sahaider', 5, '3:06');

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard_division`
--

CREATE TABLE `leaderboard_division` (
  `user` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  `time` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard_medley`
--

CREATE TABLE `leaderboard_medley` (
  `user` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  `time` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard_multiplication`
--

CREATE TABLE `leaderboard_multiplication` (
  `user` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  `time` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard_subtraction`
--

CREATE TABLE `leaderboard_subtraction` (
  `user` varchar(32) NOT NULL,
  `score` int(11) NOT NULL,
  `time` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaderboard_subtraction`
--

INSERT INTO `leaderboard_subtraction` (`user`, `score`, `time`) VALUES
('abcdefghijklmnopqrstuvwxyz123456', 32, '2:57'),
('googeyser', 65, '4:28'),
('saarah12', 24, '4:00'),
('sahaider', 65, '3:27');

-- --------------------------------------------------------

--
-- Table structure for table `user_list`
--

CREATE TABLE `user_list` (
  `user` varchar(32) NOT NULL,
  `password` varchar(128) NOT NULL,
  `is_admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_list`
--

INSERT INTO `user_list` (`user`, `password`, `is_admin`) VALUES
('abcdefghijklmnopqrstuvwxyz123456', 'abcdefg123', 0),
('googeyser', 'pa55word', 0),
('saarah12', 'letmein', 0),
('sahaider', 'secretpa55word', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daily_bank`
--
ALTER TABLE `daily_bank`
  ADD PRIMARY KEY (`question`);

--
-- Indexes for table `leaderboard_addition`
--
ALTER TABLE `leaderboard_addition`
  ADD PRIMARY KEY (`user`);

--
-- Indexes for table `leaderboard_challenge`
--
ALTER TABLE `leaderboard_challenge`
  ADD PRIMARY KEY (`user`);

--
-- Indexes for table `leaderboard_daily`
--
ALTER TABLE `leaderboard_daily`
  ADD PRIMARY KEY (`user`);

--
-- Indexes for table `leaderboard_division`
--
ALTER TABLE `leaderboard_division`
  ADD PRIMARY KEY (`user`);

--
-- Indexes for table `leaderboard_medley`
--
ALTER TABLE `leaderboard_medley`
  ADD PRIMARY KEY (`user`);

--
-- Indexes for table `leaderboard_multiplication`
--
ALTER TABLE `leaderboard_multiplication`
  ADD PRIMARY KEY (`user`);

--
-- Indexes for table `leaderboard_subtraction`
--
ALTER TABLE `leaderboard_subtraction`
  ADD PRIMARY KEY (`user`);

--
-- Indexes for table `user_list`
--
ALTER TABLE `user_list`
  ADD PRIMARY KEY (`user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
