select `sailing-experience`, `boat-building-exp` from `pc-members`;
select `reference`, concat(`member-first-name`, ' ', `member-last-name`) as `name` from `pc-members`;
select `reference` from `pc-members` group by `reference` having count(*) > 1;


-- Duplicated references
select count(*), `reference` from `pc-members` group by `reference` having count(*) > 1;

--
-- Date functions : https://www.mysqltutorial.org/mysql-date-functions/
--                  https://www.tutorialspoint.com/mysql/mysql-date-time-functions.htm
select CURRENT_TIMESTAMP() from dual;

SELECT DATEDIFF('2015-09-05', '1989-03-25');

SELECT DATEDIFF(CURRENT_TIMESTAMP(), '2024-01-01 00:00:00') as 'IN DAYS'; 
SELECT TIMEDIFF(CURRENT_TIMESTAMP(), '2024-01-01 00:00:00') as 'IN HOURS';
-- See https://www.tutorialspoint.com/mysql/mysql_date_time_functions_timestampdiff.htm for the units
SELECT TIMESTAMPDIFF(HOUR, CURRENT_TIMESTAMP(), '2024-01-01 00:00:00') as 'IN HOURS';
SELECT TIMESTAMPDIFF(HOUR, CURRENT_TIMESTAMP(), '2024-01-01') as 'IN HOURS';

-- For ER Diagrams: https://app.diagrams.net/

SELECT `email` FROM `nl-subscribers` WHERE `email` IN (SELECT `email` from `pc-members`);

-- Renouvellement de cotisation, dans moins d'un mois.
SELECT
    `command-date`,
    CONCAT(
        'In ',
        365 - TIMESTAMPDIFF(
            DAY,
            `command-date`,
            CURRENT_TIMESTAMP()),
            ' Day(s)'
        ) AS 'When',
        CONCAT(
            `member-first-name`,
            ' ',
            `member-last-name`
        ) AS NAME
    FROM
        `pc-members`
    WHERE
        TIMESTAMPDIFF(
            DAY,
            `command-date`,
            CURRENT_TIMESTAMP()) > 335;
            
-- 
-- Work without back-quotes
-- 
create table akeu (coucou int);
--
-- UPDATE NL-SUNSCRIBERS
UPDATE `nl-subscribers` SET `active` = FALSE WHERE 
-- SELECT * FROM `nl-subscribers` WHERE
    `email` LIKE '%axelle%' OR 
    `email` LIKE '%.isaac%' OR 
    `email` LIKE '%marefly%' OR 
    `email` LIKE '%foucher-p%' OR 
    `email` LIKE '%jeromedormois%' OR 
    `email` LIKE '%pellen.avocat%' OR 
    `email` LIKE '%karine.audoin%';
--
UPDATE `nl-subscribers` SET `email` = 'fred.epmg@gmail.com'
WHERE `email` = 'fredgougeon@wanadoo.fr';
--
UPDATE `nl-subscribers` SET `email` = 'unjourdaout@gmail.com'
WHERE `email` = 'didier-de.puyraimond@tactiques.fr';
--    
-- Table name is case-sensitive, column names seem not to be.
DROP TABLE AKEU_COUCOU;
CREATE TABLE AKEU_COUCOU (id int, command_date TIMESTAMP, STUFF varchar(32));
insert into AKEU_COUCOU (id, command_date, stuff) values (1, '2024-01-10 08:00:00', 'Pouet');
select * from AKEU_COUCOU;

--
-- Doublons
--
SELECT
    MEMBER_FIRST_NAME,
    CONCAT('(', COUNT(MEMBER_LAST_NAME),
    ')'),
    MEMBER_LAST_NAME
FROM
    `PC_MEMBERS`
GROUP BY
    MEMBER_LAST_NAME,
    MEMBER_FIRST_NAME
HAVING
    COUNT(MEMBER_LAST_NAME) > 1;
    