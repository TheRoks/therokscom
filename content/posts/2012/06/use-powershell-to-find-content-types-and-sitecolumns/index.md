---
title: "Use Powershell to find content types and sitecolumns"
path: "/use-powershell-to-find-content-types-and-sitecolumns"
tags: ["SharePoint"]
excerpt: "Sometimes you want to find all content types and sitecolumns you created in SharePoint. A simple way to acomplish this is the use of PowerShell. Conditional in this script is that all my custom content types and sitecolumns belong to the same group."
created: 2012-06-12
updated: 2012-06-12
---

Sometimes you want to find all content types and sitecolumns you created in SharePoint. A simple way to acomplish this is the use of PowerShell. Conditional in this script is that all my custom content types and sitecolumns belong to the same group.

```powershell
# Description
#   Output all available Content Type GUIDs and their respective fields
#
# Syntax
#   ./listCtFields
#
# Parameters
#   none
#
# Settings
#   Only change the -value parameter!
## Site collection
set-variable -option constant -name url -value "http://localhost:8000"
# Site collectionset-variable -option constant -name out -value "c:ListOfAllCTs.csv"  
# End of settings

$site = new-object Microsoft.SharePoint.SPSite($url)
$cts = $site.rootweb.ContentTypes
echo "Processing..."

'"CT Name"' + 
',"CT ID"' + 
',"CT Description"' + 
',"CT Group"' +
',"Field Title"' + 
',"Field Internal Name"' + 
',"Field ID"' + 
',"Field Group"' + 
',"Field Max Length"' + 
',"Field Description"' | Out-File -out

ForEach ($id in $cts)
{
    if ($id.Group -eq "Interpolis")
    {
      ForEach ($field in $id.Fields)
      {
          if ($field.Group -eq "Interpolis")
          {
            '"' + $id.Name + `
            '","' + $id.Id + `
            '","' + $id.Description + `
            '","' + $id.Group + `
            '","' + $field.Title + `
            '","' + $field.InternalName + `
            '","' + $field.Id + `
            '","' + $field.Group + `
            '","' + $field.MaxLength + `
            '","' + $field.Description + `
            '"' | Out-File -out -append
          }
      }
   }
}

$site.Dispose()

echo "Finished!"
```

Hope this helps!
