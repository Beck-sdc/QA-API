CREATE TABLE `Question` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `body` varchar(255),
  `date_id` int,
  `name_id` int,
  `helpfulness` int,
  `reported` boolean,
  `product_id` int
);

CREATE TABLE `Answer` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `body` varchar(255),
  `date_id` int,
  `name_id` int,
  `helpfulness` int,
  `reported` boolean,
  `question_id` int
);

CREATE TABLE `Names` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `Dates` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `date` varchar(255)
);

CREATE TABLE `Photos` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `url` varchar(255)
);

CREATE TABLE `Answer_Photos` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `answer_id` int,
  `photo_id` int
);

ALTER TABLE `Question` ADD FOREIGN KEY (`date_id`) REFERENCES `Dates` (`id`);

ALTER TABLE `Question` ADD FOREIGN KEY (`name_id`) REFERENCES `Names` (`id`);

ALTER TABLE `Answer` ADD FOREIGN KEY (`date_id`) REFERENCES `Dates` (`id`);

ALTER TABLE `Answer` ADD FOREIGN KEY (`name_id`) REFERENCES `Names` (`id`);

ALTER TABLE `Answer` ADD FOREIGN KEY (`question_id`) REFERENCES `Question` (`id`);

ALTER TABLE `Answer_Photos` ADD FOREIGN KEY (`answer_id`) REFERENCES `Answer` (`id`);

ALTER TABLE `Answer_Photos` ADD FOREIGN KEY (`photo_id`) REFERENCES `Photos` (`id`);
