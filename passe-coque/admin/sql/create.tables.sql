-- Doc at https://www.mysqltutorial.org/mysql-basics/mysql-auto_increment/
--        https://www.w3schools.com/php/php_mysql_create_table.asp           <- Good for mySQLi
--
-- Table structure for table `nl-subscribers`, News Letter Subscribers
--

CREATE TABLE contacts(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL
);

-- Make email a unique key
CREATE TABLE IF NOT EXISTS `nl-subscribers` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'First and Last Name of the Subscriber',
    `email` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Email of the Subscriber',
    CONSTRAINT UK_email UNIQUE (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT = 'News Letter Subscribers';


INSERT INTO `nl-subscribers`(`name`, `email`)
VALUES('Joe Shmow', 'joe.show@mysqltests.org');

INSERT INTO `nl-subscribers`(`name`, `email`)
VALUES('Job Larigou', 'job.larigou@mysqltests.org');

SELECT * FROM `nl-subscribers`;
