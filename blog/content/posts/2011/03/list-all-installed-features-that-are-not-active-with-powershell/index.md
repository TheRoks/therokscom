---
title: "List all installed features that are not active with Powershell"
path: "/list-all-installed-features-that-are-not-active-with-powershell/"
tags: ["SharePoint"]
excerpt: "List all installed features that are not active features with Powershell. See in this post how this can be done with a small script."
created: 2011-03-15
updated: 2011-03-15
---

Powershell script to automatic deploy SharePoint solutions. However when activating features that were already active an error occurs.

## The Problem with activating features

When you enable a feature that is already active you’ll get an error message.

`Enable-SPFeature : Feature ‘BasicWebParts’ (ID: 00bfea71-1c5e-4a24-b310-ba51c3eb7a57) is already activated at scope`

This can be solved by using -ErrorAction SilentlyContinue but this hides all possible errors that can occur. So this is not the behaviour we want.

## List them with Get-SPFeature in Powershell

To solve this I wrote a script to list all inactive features.

```powershell
$siteFeatures = Get-SPFeature | Where-Object {$_.Scope -eq "Site" } # Farm, WebApp, Site and Web
if ($siteFeatures -ne $null)
{
  foreach ($feature in $siteFeatures)
  {
    # -Site can be replace by -Farm (without url), -WebApp, -Web
    if ((Get-SPFeature -Site "http://default-app.theroks.com/" | Where-Object {$_.Id -eq $feature.id}) -eq $null)
    {
      # Inactive feature
      Write-Host "$($feature.Scope) feature $($feature.DisplayName) " -ForeGroundColor DarkRed
    }
   }
}
```

This is just a part of the solution. But it is enough to determine when to safely activate features.

For a full reference on `Get-SPFeature` check [MSDN](http://technet.microsoft.com/en-us/library/ff607945.aspx).

Hope this helps!
