-- Doc at https://www.mysqltutorial.org/mysql-basics/mysql-auto_increment/
--        https://www.w3schools.com/php/php_mysql_create_table.asp           <- Good for mySQLi
--
-- Table structure for tables:
--    `nl-subscribers`, News Letter Subscribers
--    `pc-mebers`
-- For MySQL Data Types, see https://www.w3schools.com/mysql/mysql_datatypes.asp
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

CREATE TABLE IF NOT EXISTS `pc-members` (
    id INT AUTO_INCREMENT PRIMARY KEY, -- reference is NOT unique enough...
    `reference` INT,
    `command-date` TIMESTAMP,      -- Format: YYYY-MM-DD hh:mm:ss
    `command-status` VARCHAR(32),
    `member-first-name` VARCHAR(64),
    `member-last-name` VARCHAR(64),
    `card-url` VARCHAR(512),
    `payer-first-name` VARCHAR(64),
    `payer-last-name` VARCHAR(64),
    `payer-email` VARCHAR(64),
    `company-name` VARCHAR(64),
    `paid-with` VARCHAR(32),
    `fee-category` VARCHAR(32),
    `fee-amount` FLOAT,
    `promo-code` VARCHAR(16),
    `promo-amount` FLOAT,
    `phone` VARCHAR(16),
    `email` VARCHAR(64),
    `address` VARCHAR(128),
    `zip` VARCHAR(8),
    `birth-date` DATE,  -- format 'YYYY-MM-DD'
    `city` VARCHAR(32),
    `sailing-experience` VARCHAR(256),
    `boat-building-exp` VARCHAR(256),
    `comments` VARCHAR(512)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT = 'Passe-Coque members';

-- Exemple, from
-- 75163629;28/11/2023 21:43;Validé;Gambier;Sophie;https://www.helloasso.com/associations/passe-coque-l-association-des-passeurs-d-ecoute/adhesions/adhesion-simple/carte-adherent?cardId=75163629&ag=75163629;Gambier;Sophie;sophie.gambier01@gmail.com;;Carte bancaire;Passeur d'Ecoute;50,00;;;0769455969;sophie.gambier01@gmail.com;sophie.gambier01@gmail.com;44300;08/12/2001;Nantes;Equipière confirmée;aucune;

INSERT INTO `pc-members` (
    `reference`, 
    `command-date`,
    `member-first-name`, 
    `member-last-name`, 
    `email`, 
    `birth-date`,
    `sailing-experience`)     
VALUES (75163629, 
       '2023-11-28 21:43:00', 
       'Sophie', 
       'Gambier', 
       'sophie.gambier01@gmail.com', 
       '2011-12-08',
       'Equipière confirmée');

select `member-first-name`, `member-last-name`, `birth-date` from `pc-members`;
