---
title: "List all the rich text fields with inline styling in Sitecore with Powershell Extensions"
path: "/list-all-the-rich-text-fields-with-inline-styling-in-sitecore-with-powershell-extensions/"
tags: ["Sitecore"]
excerpt: "Search for inline styling in Rich Text fields in Sitecore using a Sitecore Powershell Extensions script."
created: 2018-12-12
updated: 2018-12-12
---

In our project we agreed that content editors do not use inline styling in Rich Text Fields. We did not make it impossible in the Rich Text Editor of Sitecore to use it. This can be done, but for several reasons we didn't do this (yet).

To determine where inline styling is used. I made a Sitecore Powershell Extenions script to detect where inline styling is used. To do this, the script searches for every item in the content tree with a Rich Text Field. For every Rich Text Field, the value is check for the text "style=". If it contains this text, it has inline styling, which in most cases is not what we want.

The script generates a report of these fields in a grid. This is done with the command Show-ListView Which is a nice feature of Sitecore Powershell Extensions. In this grid you can easily navigate to the item or even make an export to a CSV or Excel file.

```powershell
<#
    .SYNOPSIS
        Lists all the fields with inline styling.
        
    .NOTES
        Stefan Roks
#>

$item = Get-Item -Path master:\content\

$user = ""

$props = @{
    Title = "Rich Text Fields with inline styling"
    Description = "This report will analyse the branch and will tell you which fields have inline styling."
    Width = 600
    Height = 300
    OkButtonName = "Proceed"
    CancelButtonName = "Abort"
    Parameters = @(
        @{ Name = "item"; Title="Root Item"; Tooltip="Branch you want to analyse."}
    )
}

$result = Read-Variable @props

if($result -ne "ok") {
    Close-Window
    Exit
}

$items = Get-ChildItem -Path $item.ProviderPath -Recurse -Language * 
           | Where-Object { $_.Fields 
           | Where-Object {$_.Type -eq "Rich Text"} 
           | Where-Object {$_.Value -like "*style*"} }


if($items.Count -eq 0) {
    Show-Alert "There are no items found with inline styling."
} else {
    $props = @{
        Title = "Rich Text Fields with inline styling"
        InfoTitle = "Fields with inline styling"
        InfoDescription = 'Lists all the fields with inline styling.'
        PageSize = 25
    }

    $items |
        Show-ListView @props -Property @{Label="Name"; Expression={$_.DisplayName} },
            @{Label="Owner"; Expression={ $_.__Owner} },
            @{Label="Updated"; Expression={$_.__Updated} },
            @{Label="Updated by"; Expression={$_."__Updated by"} },
            @{Label="Created"; Expression={$_.__Created} },
            @{Label="Created by"; Expression={$_."__Created by"} },
            @{Label="Path"; Expression={$_.ItemPath} }
}

Close-Window
```

Happy scripting!
