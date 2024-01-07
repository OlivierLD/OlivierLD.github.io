-- Duplicatedf references
select count(*), `reference` from `pc-members` group by `reference` having count(*) > 1;
