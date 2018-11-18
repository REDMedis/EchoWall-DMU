DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(10) NOT NULL auto_increment,
  `userId` int(11) NOT NULL,
  `echoId` char(10) NOT NULL,
  `content` text NOT NULL,
  `time` datetime DEFAULT NULL,
  `likeNum` int(11) DEFAULT 0,
  `dislikeNum` int(11) DEFAULT 0,  
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (userId) REFERENCES userInfo(id) ON DELETE  RESTRICT  ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (echoId) REFERENCES echowall(id) ON DELETE  RESTRICT  ON UPDATE CASCADE  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `userAction`;
CREATE TABLE `userAction` (
  `id` int(10) NOT NULL auto_increment,
  `userId` int(11) NOT NULL,
  `actionType` char(10) NOT NULL,
  `echoId` char(10),
  `commentId` int(10),
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT FOREIGN KEY (userId) REFERENCES userInfo(id) ON DELETE  RESTRICT  ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (echoId) REFERENCES echowall(id) ON DELETE  RESTRICT  ON UPDATE CASCADE,  
  CONSTRAINT FOREIGN KEY (commentId) REFERENCES comment(id) ON DELETE  RESTRICT  ON UPDATE CASCADE  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

