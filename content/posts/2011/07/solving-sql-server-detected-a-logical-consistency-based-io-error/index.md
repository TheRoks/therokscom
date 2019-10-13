---
title: "Solving: SQL Server detected a logical consistency-based I/O error"
path: "/solving-sql-server-detected-a-logical-consistency-based-io-error"
tags: ["SharePoint"]
excerpt: "When creating a new Secure Store Service Application in SharePoint 2010 I had this error:
Creation of Secure Store Service Application SecureStoreService failed because of the following errors: SQL Server detected a logical consistency-based I/O error: unable to decrypt page due to missing DEK."
created: 2011-07-28
updated: 2011-07-28
---


When creating a new Secure Store Service Application in SharePoint 2010 I had this error:

`Creation of Secure Store Service Application SecureStoreService failed because of the following errors: SQL Server detected a logical consistency-based I/O error: unable to decrypt page due to missing DEK. It occurred during a read of page (1:15848) in database ID 5 at offset 0x00000007bd0000 in file ‘C:Program FilesMicrosoft SQL ServerMSSQL10_50.MSSQLSERVERMSSQLDATAdev.local_SharePoint_Configuration_Database.mdf’. Additional messages in the SQL Server error log or system event log may provide more detail. This is a severe error condition that threatens database integrity and must be corrected immediately. Complete a full database consistency check (DBCC CHECKDB). This error can be caused by many factors; for more information, see SQL Server Books Online.`

There was definitely something wrong with SharePoints configuration database. But as the error message said I did run a DBCC CHECKDB. This was the result:

```sql
DBCC results for ‘dev.local_SharePoint_Configuration_Database’.

Service Broker Msg 9675, State 1: Message Types analyzed: 14.

Service Broker Msg 9676, State 1: Service Contracts analyzed: 6.

Service Broker Msg 9667, State 1: Services analyzed: 3.

Service Broker Msg 9668, State 1: Service Queues analyzed: 3.

Service Broker Msg 9669, State 1: Conversation Endpoints analyzed: 0.

Service Broker Msg 9674, State 1: Conversation Groups analyzed: 0.

Service Broker Msg 9670, State 1: Remote Service Bindings analyzed: 0.

Service Broker Msg 9605, State 1: Conversation Priorities analyzed: 0.

Msg 8939, Level 16, State 98, Line 1

Table error: Object ID 0, index ID -1, partition ID 0, alloc unit ID -446695742437851136 (type Unknown), page (44310:821622156). Test (IS_OFF (BUF_IOERR, pBUF->bstat)) failed. Values are 12716041 and -4.

Msg 8939, Level 16, State 98, Line 1

Table error: Object ID 0, index ID -1, partition ID 0, alloc unit ID 3740297223666139136 (type Unknown), page (29042:-1451589555). Test (IS_OFF (BUF_IOERR, pBUF->bstat)) failed. Values are 12716041 and -14.

CHECKDB found 0 allocation errors and 2 consistency errors not associated with any single object.

DBCC results for ‘sys.sysrscols’.

There are 790 rows in 9 pages for object “sys.sysrscols”.

DBCC results for ‘sys.sysrowsets’.

…

There are 0 rows in 1 pages for object “TimerRunningJobs”.

DBCC results for ‘TimerJobHistory’.

Msg 8928, Level 16, State 1, Line 1

Object ID 1413580074, index ID 1, partition ID 72057594041663488, alloc unit ID 72057594043367424 (type In-row data): Page (1:15840) could not be processed.  See other errors for details.

Msg 8976, Level 16, State 1, Line 1

Table error: Object ID 1413580074, index ID 1, partition ID 72057594041663488, alloc unit ID 72057594043367424 (type In-row data). Page (1:15840) was not seen in the scan although its parent (1:15990) and previous (1:15831) refer to it. Check any previous errors.

Msg 8978, Level 16, State 1, Line 1

Table error: Object ID 1413580074, index ID 1, partition ID 72057594041663488, alloc unit ID 72057594043367424 (type In-row data). Page (1:15841) is missing a reference from previous page (1:15840). Possible chain linkage problem.

Msg 8928, Level 16, State 1, Line 1

Object ID 1413580074, index ID 1, partition ID 72057594041663488, alloc unit ID 72057594043367424 (type In-row data): Page (1:15848) could not be processed.  See other errors for details.

Msg 8976, Level 16, State 1, Line 1

Table error: Object ID 1413580074, index ID 1, partition ID 72057594041663488, alloc unit ID 72057594043367424 (type In-row data). Page (1:15848) was not seen in the scan although its parent (1:15990) and previous (1:15846) refer to it. Check any previous errors.

Msg 8978, Level 16, State 1, Line 1

Table error: Object ID 1413580074, index ID 1, partition ID 72057594041663488, alloc unit ID 72057594043367424 (type In-row data). Page (1:15849) is missing a reference from previous page (1:15848). Possible chain linkage problem.

There are 343473 rows in 11002 pages for object “TimerJobHistory”.

CHECKDB found 0 allocation errors and 6 consistency errors in table ‘TimerJobHistory’ (object ID 1413580074).

DBCC results for ‘TimerScheduledJobs’.

There are 149 rows in 2 pages for object “TimerScheduledJobs”.

DBCC results for ‘sys.queue_messages_1977058079’.

There are 0 rows in 0 pages for object “sys.queue_messages_1977058079”.

DBCC results for ‘sys.queue_messages_2009058193’.

There are 0 rows in 0 pages for object “sys.queue_messages_2009058193”.

DBCC results for ‘sys.queue_messages_2041058307’.

There are 0 rows in 0 pages for object “sys.queue_messages_2041058307”.

DBCC results for ‘sys.filestream_tombstone_2073058421’.

There are 0 rows in 0 pages for object “sys.filestream_tombstone_2073058421”.

DBCC results for ‘sys.syscommittab’.

There are 0 rows in 0 pages for object “sys.syscommittab”.

DBCC results for ‘Versions’.

There are 3 rows in 1 pages for object “Versions”.

CHECKDB found 0 allocation errors and 8 consistency errors in database ‘dev.achmea.local_SharePoint_Configuration_Database’.

repair_allow_data_loss is the minimum repair level for the errors found by DBCC CHECKDB (dev.achmea.local_SharePoint_Configuration_Database).

DBCC execution completed. If DBCC printed error messages, contact your system administrator.
```

Reading this very carefully learned me there was something wrong with the TimerJobHistory table. DBCC CHECKDB runs three commands;

* It runs `DBCC CHECKALLOC` on the database.
* It runs `DBCC CHECKTABLE` on every table and view in the database.
* It runs `DBCC CHECKCATALOG` on the database.

The DBCC CHECKTABLE statement confirmed that TimerJobHistory was corrupt. So I dropped the table and recreated it. Problem solved? Not really, underlying there is a hardware problem you should fix. See again MSDN.