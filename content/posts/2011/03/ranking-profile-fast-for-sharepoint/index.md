---
title: "Create Ranking profile with FAST for SharePoint 2010"
path: "/ranking-profile-fast-for-sharepoint/"
tags: ["SharePoint"]
excerpt: "When working on a SharePoint 2010 project search was done by using FAST for SharePoint. the FAST search engine is much more advanced than the enterprise search that comes with SharePoint. FAST for SharePoint will visually fully integrate with SharePoint. Maintenance will be done in the Central Administration. When the Central Administration is not enough PowerShell is there to rescue."
created: 2011-03-29
updated: 2011-03-29
---

When working on a SharePoint 2010 project search was done by using FAST for SharePoint. the FAST search engine is much more advanced than the enterprise search that comes with SharePoint. FAST for SharePoint will visually fully integrate with SharePoint. Maintenance will be done in the Central Administration. When the Central Administration is not enough PowerShell is there to rescue.

## Goal to achieve

In the results files with extension pdf need to show lower in the ranking than all other results.

## How it is done in FAST for SharePoint

Display properties Search Action Links web partThe order of ranking is determined by a ranking profile. FAST for SharePoint has out of the box a lot ranking profiles like; relevance, size, site rank, date and many others. The default sort order is relevance. The only change to the relevance profile is that pdf documents will be lower ranked. To achieve the result we will make a copy of the relevance profile and demote pdf documents.

## This was done by creating a PowerShell script.

```powershell
$rp = Get-FASTSearchMetadataRankProfile -name default
$np = New-FASTSearchMetadataRankProfile -name pdf -template $rp
$fileext = Get-FASTSearchMetadataManagedProperty -Name fileextension
$np.CreateManagedPropertyBoostComponent($fileext, "pdf,-200000")
$np.update()
```

This script first makes a copy of the default profile and after that will take the MetadataManagedProperty fileextension that we will boost with -20000. Because we only have a the possibilty to boost it has to be a negative number to get a lower ranking.

## Conclusion

Creating the new ranking profile is half of the job. The rest is configure the searchactionlinks webpart. Edit the SearchActionLinks webpart under display properties. Enable the new rank profile and set it as the default. If you don’t see the pdf as an options, be sure that the location is set to Local FAST Search Results.
