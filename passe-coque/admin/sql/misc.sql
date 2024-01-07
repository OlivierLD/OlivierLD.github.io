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
