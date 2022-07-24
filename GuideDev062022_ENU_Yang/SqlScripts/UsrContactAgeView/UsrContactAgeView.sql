IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[dbo].[UsrVwContactAgeDays]'))
DROP VIEW [dbo].UsrVwContactAgeDays
GO
create view UsrVwContactAgeDays as
select Id as UsrId, Name as UsrName, 
BirthDate as UsrBirthDate, 
datediff(DAY, BirthDate, getdate()) as UsrAgeDays
from Contact
GO