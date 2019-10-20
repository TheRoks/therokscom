---
title: "Synchronous document conversion with Word automation"
path: "/synchronous-document-conversion-with-word-automation/"
tags: ["SharePoint"]
excerpt: "Synchronous document conversion with Word Automation Services in SharePoint 2013. This post show what's new in SharePoint 2013."
created: 2013-02-22
updated: 2013-02-22
---

In a previous post I explained about Word Automation Services in SharePoint 2010. It worked and the converted files were of a good quality. However there was still some space for improvements. I’ll show what changed in SharePoint 13 in the Word Automation Services.

## Drawbacks in SharePoint 2010

* Solutions must wait until timer job executes for file generation
* Can only handle files in SharePoint
* No easy way to know when conversion has been completed

## Word Automation in SharePoint 2013

* New Immediate based request (no waiting)
 * New option to execute conversion immediately, not necessarily from timer job
 * Operate on one file at the time per request
 * Configuration options from CA for simultaneous request amount
* Notify or update items in SharePoint after completion
 * Word Automation Services can perform file conversions and can update files
* Allow WAS to support streams
 * Convert streams from API perspective as inputs and outputs for file operations
 * Streams are stored in memory within Application Server Manager and Worker – not in content database

## Architecture

![WordAutomationArchitectureSharePoint13](./WordAutomatationArchitectureSharePoint13.png)

## Object model

The object model has a new class, SyncConverter. The Convert method brings new capabilities. With the ConvertJob there was only the possibility to convert files that were in SharePoint. This new method offers the option to convert streams and byte array’s besides the already existing url.

## Create an on demand file conversion

```csharp
public static byte[] WriteSpFile(SPFile spFile)
{
   using (Stream read = spFile.OpenBinaryStream())
   {
       using (MemoryStream write = new MemoryStream())
       {
           string wordAutomationServiceName = "Word Automation Services";
           SyncConverter sc = new SyncConverter(wordAutomationServiceName);
           SPSite spSite = SPContext.Current.Site;
           sc.UserToken = spSite.UserToken;
           sc.Settings.UpdateFields = true;
           sc.Settings.OutputFormat = SaveFormat.PDF;

           ConversionItemInfo info = sc.Convert(read, write);
           if (info.Succeeded)
           {
               return write.ToArray();
           }
       }
   }
   return null;
}
```

The code snippet above shows a synchronous document conversion with streams. The code inside the using statement is the real conversion. There’s no direct option to convert a url to a stream. I think this should be added in the next version.
