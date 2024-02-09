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
    `active`  boolean default TRUE,
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

CREATE TABLE IF NOT EXISTS PC_MEMBERS (
    ID INT AUTO_INCREMENT PRIMARY KEY, -- reference is NOT unique enough...
    REFERENCE INT,
    COMMAND_DATE TIMESTAMP,      -- Format: YYYY-MM-DD hh:mm:ss
    COMMAND_STATUS VARCHAR(32),
    MEMBER_FIRST_NAME VARCHAR(64),
    MEMBER_LAST_NAME VARCHAR(64),
    CARD_URL VARCHAR(512),
    PAYER_FIRST_NAME VARCHAR(64),
    PAYER_LAST_NAME VARCHAR(64),
    PAYER_EMAIL VARCHAR(64),
    COMPANY_NAME VARCHAR(64),
    PAID_WITH VARCHAR(32),
    FEE_CATEGORY VARCHAR(32),
    FEE_AMOUNT FLOAT,
    PROMO_CODE VARCHAR(16),
    PROMO_AMOUNT FLOAT,
    PHONE VARCHAR(16),
    EMAIL VARCHAR(64),
    ADDRESS VARCHAR(128),
    ZIP VARCHAR(8),
    BIRTH_DATE DATE,  -- format 'YYYY-MM-DD'
    CITY VARCHAR(32),
    SAILING_EXPERIENCE VARCHAR(256),
    BOAT_BUILDING_EXP VARCHAR(256),
    COMMENTS VARCHAR(512)
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

CREATE TABLE IF NOT EXISTS PC_NUMBERS (
    ID VARCHAR(32) PRIMARY KEY,
    AMOUNT INT DEFAULT 0,
    DESCRIPTION VARCHAR(128)
);
INSERT INTO PC_NUMBERS (ID, AMOUNT, DESCRIPTION) VALUES ('NB_VIEWS', 0, 'Number of views of the site');

CREATE TABLE IF NOT EXISTS PC_TRACKER (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    EVENT_DATE TIMESTAMP,
    CLIENT_IP VARCHAR(64),
    APP_CODE_NAME VARCHAR(64),
	BROWSER_NAME VARCHAR(64),
	PRODUCT VARCHAR(64),
	BROWSER_VERSION VARCHAR(64),
	BROWSER_LANGUAGE VARCHAR(64),
	PLATFORM VARCHAR(64),
	USER_AGENT VARCHAR(64),
	LATITUDE FLOAT,
    LONGITUDE FLOAT
);

SELECT COUNT(CLIENT_IP) AS NB_HIT, MIN(EVENT_DATE) AS SINCE, PLATFORM, BROWSER_LANGUAGE from PC_TRACKER GROUP BY CLIENT_IP ORDER BY 1 DESC;

CREATE TABLE IF NOT EXISTS PC_USERS (
    USERNAME VARCHAR(64) PRIMARY KEY,
    PASSWORD VARCHAR(64),
    SOME_CONTENT VARCHAR(512) COMMENT 'Whatever you want goes here'
);

INSERT INTO PC_USERS (USERNAME, PASSWORD, SOME_CONTENT) VALUES ('olivier@lediouris.net', sha1('c2h5oh'), 'Akeu Coucou!');
INSERT INTO PC_USERS (USERNAME, PASSWORD, SOME_CONTENT) VALUES ('admin@passe-coque.com ', sha1('manager'), 'For tests');
