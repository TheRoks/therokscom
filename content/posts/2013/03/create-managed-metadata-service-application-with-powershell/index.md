---
title: "Create Managed Metadata Service Application with Powershell"
path: "/create-managed-metadata-service-application-with-powershell/"
tags: ["SharePoint"]
excerpt: Managed metadata service applications are administered from within SharePoint Central Administration, where you get an overview of all available service applications. But everything over there can also be done in Powershell i.e. creating a Managed Metadata Service Application.
created: 2013-03-08
updated: 2013-03-08
---

Managed metadata service applications are administered from within SharePoint Central Administration, where you get an overview of all available service applications. But everything over there can also be done in Powershell i.e. creating a Managed Metadata Service Application.

## Creating the Managed Metadata Service Application

When you initially create a new managed metadata service, you must specifiy the name, database, application pool, and the URL for the content type hub from which the service application will consume content types. Because a web application can have connections to multiple managed metadata services, you must configure a number of options. These settings are controlled in the Managed Metadata Service Connections properties screen.

## The Powershell script

Installation and configuration of all there different options can be a tedious and error-prone taks. This is where Powershell comes around the corner. All the different operations from within Central Administration with regard to managed metadata service are also available as Powershell cmdlets. The script below creates a new Managed Metadata Service Application.

```powershell
# Loading Microsoft.SharePoint.PowerShell
$snapin = Get-PSSnapin | Where-Object {$_.Name -eq 'Microsoft.SharePoint.Powershell'}
if ($snapin -eq $null) {
  Write-Host "Loading SharePoint Powershell Snapin"
  Add-PSSnapin "Microsoft.SharePoint.Powershell"
}

$ManagedAccount = Get-SPManagedAccount | select -First 1
if ($ManagedAccount -eq $null) { throw "No Managed Account" }

$ApplicationPool = Get-SPServiceApplicationPool "SharePoint Hosted Services" -ErrorAction SilentlyContinue
if ($ApplicationPool -eq $null)
{
  $ApplicationPool = New-SPServiceApplicationPool "SharePoint Hosted Services" -Account $ManagedAccount
  if (-not $?) { throw "Failed to create an application pool" }
}

Write-Progress "Creating Taxonomy Service Application" -Status "Please Wait..."

$MetadataseviceInstance = (Get-SPServiceInstance |?{$_.TypeName -eq "Managed Metadata Web Service"})
if (-not $?) { throw "Failed to find Metadata service instance" }

if ($MetadataseviceInstance.Status -eq "Disabled")
{
  $MetadataseviceInstance | Start-SPServiceInstance
  if (-not $?) { throw "Failed to start Metadata service instance" }
}

while (-not ($MetadataseviceInstance.Status -eq "Online"))
{
  Write-Host "Waiting for provisioning ..."; sleep 5;
}

$MetaDataServiceApp = New-SPMetadataServiceApplication -Name "Demo Metadata Service Application" -ApplicationPool $ApplicationPool
if (-not $?) {throw "Failed to create Metadata Service Application" }

$MetadataServiceAppProxy = New-SPMetadataServiceApplicationProxy -Name "Demo Metadata Service Application Proxy" -ServiceApplication $MetaDataServiceApp -DefaultProxyGroup

# This service application is the default storage location for Keywords.
$MetadataServiceAppProxy.Properties["IsDefaultKeywordTaxonomy"] = $false

# This service application is the default storage location for column specific term sets.
$MetadataServiceAppProxy.Properties["IsDefaultSiteCollectionTaxonomy"] = $false

# Consumes content types from the Content Type Gallery
$MetadataServiceAppProxy.Properties["IsNPContentTypeSyndicationEnabled"] = $false

# Push-down Content Type Publishing updates from the Content Type Gallery
# to sub-sites and lists using the content type.
$MetadataServiceAppProxy.Properties["IsContentTypePushdownEnabled"] = $false

$MetadataServiceAppProxy.Update()
```

See all Cmdlets on Managed Metadata Service on [Technet](http://technet.microsoft.com/en-us/library/ff871452.aspx)
