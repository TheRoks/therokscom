---
title: "Enable Browser File Handling for Flash with Powershell"
path: "/enable-browser-file-handling-for-flash-with-powershell/"
tags: ["SharePoint"]
excerpt: "Browser File Handling is a SharePoint 2010 security feature. It can be done by setting the Browser File Handling. But there's a better way."
created: 2013-02-28
updated: 2013-02-28
---


Introduced into SharePoint 2010 as a security feature and the same applies to SharePoint 2013. When a user requests a file within SharePoint, the web server (IIS) will respond including the “X-Download-Options: noopen” HTTP Response Header if Browser File Handling is set to Strict and the file (MIME) type accessed is not on the Web Applications trusted file (MIME) type list. This header works in conjunction with Internet Explorer (version 8 or higher) to prevent potential security risks when accessing files online and will stop files from being directly opened.

## The Options

There are two options for Browser File Handling – “Strict” and “Permissive”.

* “Strict” specifies the MIME types which are not listed in a Web Application’s AllowedInlineDownloadedMimeTypes property (more on this in a bit) are forced to be downloaded.
* “Permissive” specifies that the HTML and other content types which might contain script are allowed to be displayed directly in the browser. In other words, no matter what the type of content, if it lives within SharePoint, the file will open in your browser.

## How to set Browser File Handling

The only one you can manage through the web interface is the Web Application level Browser File Handling property. To do so, here is the click by click:

Go to Central Administration > Manage Web Applications –> [Highlight a web application] –> click General Settings in the Ribbon –> Scroll down in the General Settings window to see Browser File Handling. Set as desired. Save settings.

However don’t do this! The best option is not available through the web interface.

## Allow MIME Types with Powershell

To set handle specific MIME types in SharePoint, you can use the script below. It’s a function that will add a MIME type to a WebApplication. In the example below Flash is allow. This can also be replaced for other MIME types.

```powershell
function Add-SPWebApplicationMimeType {
[CmdletBinding()]
Param(
[Parameter(Mandatory=$true, ValueFromPipeline=$true, Position=0)]
[Microsoft.SharePoint.PowerShell.SPWebApplicationPipeBind]$WebApplication,
[Parameter(Mandatory=$true, ValueFromPipeline=$true, Position=1)]
[string]$MIMEType
)
    Process {

        Write-Verbose "Entering Process Block - Add-SPWebApplicationMimeType"
        try {
            Write-Verbose "Get Web Application"
            $WebApp = Get-SPWebApplication $WebApplication
            $WebAppDisplayName = $WebApp.DisplayName

            $MIMETypeLowerCase = $MIMEType.ToLower().ToString()

            Write-Verbose "Get Web Application AllowedInlineDownloadedMimeTypes"
            $MimeTypes = $WebApp.AllowedInlineDownloadedMimeTypes

            Write-Verbose "Attempt to add the $MIMEType MIME Type if it exists in the AllowedInlineDownloadedMimeTypes collection"
            if($MimeTypes -notcontains $MIMETypeLowerCase) {
                $MimeTypes.Add($MIMETypeLowerCase) | Out-Null
                $WebApp.Update()
                Write-Verbose "Add the $MIMETypeLowerCase MIME Type from the AllowedInlineDownloadedMimeTypes collection"
            }
            else {
                Write-Warning "The MIME Type '$MIMETypeLowerCase' already exists in the '$WebAppDisplayName' Web Application. No Add action taken."
            }

        }
        catch {
            Write-Error "There has been an error while attempting to add the specified MIME Type from the AllowedInlineDownloadedMimeTypes collection of the specified Web Application."
            Write-Error "Try running PowerShell as Administrator and make sure you have proper PSShellAdmin permissions to the underlying SPContentDatabase for the specified Web Application"
        }
    }
}

$webappurl = Read-Host "Enter Web Application URL"
Add-SPWebApplicationMimeType $webappurl "application/x-shockwave-flash"
```

## Summary

It is recommended that for all Web Applications, you keep the default Browser File Handling setting – Strict. This promotes the best security practice and if you require MIME type exceptions, then add the specific MIME type to your Web Application’s AllowedInlineDownloadedTypes property list.
