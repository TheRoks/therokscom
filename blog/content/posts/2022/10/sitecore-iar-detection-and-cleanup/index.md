---
title: "Sitecore Detect Overrides on Items as Resources and revert it"
path: "/sitecore-detect-override-on-items-as-resources-and-revert-it/"
tags: ["Sitecore", "IAR", "PSE"]
excerpt: Sitecore's feature to store items as a resource file on disk has some challenges when you want to revert your edits.
created: 2022-10-17
updated: 2022-10-17
---

Sitecore introduced in version 10.1 Items as Resource. With this feature, Sitecore items come directly from a resource file instead of the database. However, these items can still be in de database as well. In this case, an item is in a resource file and the database. The database will win and will be seen in the content editor in Sitecore.

When such an item is overridden in the database, nobody will know and there is no safe way to delete these items. With this post, we'll find these IAR items and remove them safely from the database.

## Anatomy of CompositeDataProvider

This journey will start at the new `CompositeDataProvider` in Sitecore. This can be found in the `Sitecore.Kernel.dll`. This data provider combines two other providers. The `HeadProvider` and the collection of `ReadOnlyDataProviders`. In short, the head provider is your database and the read-only data providers contain the items as resource. These two properties are internal and therefore not exposed.

## Sitecore internal code

Another option lives on the `Item.ItemDefinition.IsResource` property. However, this is also internal and not exposed.

There is at this moment no straightforward way to read the contents of the database and IAR files without these properties. There are several options on the internet, but they all create a lot of overhead to determine if an item is overridden.

## Customizing CompositeDataProvider

To use the in-memory option of the CompositeDataProvider we need to override this class and expose the `ReadOnlyDataProviders` and `HeadProvider` properties. This can easily be patched in Sitecore without changing the behavior of the composite data provider.

### Find the difference between Resource files and Database

Now we override the CompositeDataProvider we can also add a method to check if an item is overridden in the database. Therefore we add this method to our newly created class.

```csharp
public bool IsItemOverriddenInHead(ID id)
{
  if (id == ID.Null)
  {
    return false;
  }
  
  var callContext = new CallContext(Database.DataManager, Database.GetDataProviders().Length);
  foreach (var readonlyProvider in ReadOnlyDataProviders)
  {
    foreach (var item in readonlyProvider.DataSet.Definitions.Values)
    {
      if (item.ID == id.Guid)
      {
        var itemDefinition = HeadProvider.GetItemDefinition(new ID(item.ID), callContext);
        if (itemDefinition != null)
        {
          return true;
        }
      }
    }
  }
  return false;
}
```

We loop through all read-only data providers and within each data provider, we search in the dataset for our current item ID. When we find this item in the read-only data providers, we'll check if this item also exists in the head provider (the database).

### Remove Item from Database

Next, we add a method that will provide us with the deletion of the database item.

```csharp
public void DeleteItemFromHead(ID id)
{
  if (id == ID.Null)
  {
    return;
  }

  var callContext = new CallContext(Database.DataManager, Database.GetDataProviders().Length);
  var itemDefinition = HeadProvider.GetItemDefinition(id, callContext);

  if (itemDefinition != null)
  {
    Sitecore.Diagnostics.Log.Info($"Remove item '{id}' from HeadProvider", this);
    HeadProvider.DeleteItem(itemDefinition, callContext);
  }
} 
```

In this method, we delete the item explicitly from the `HeadProvider`. With these two methods possibilities to use this are several.

## Powershell Extensions

A nice way to get an overview of all the items that are overridden by the database is to use [Sitecore Powershell Extensions](<https://doc.sitecorepowershell.com/>). Below is a very basic script to retrieve all items in the master or core database that are overridden. This report can be part of reports. Where you can create an [Report Action](<https://doc.sitecorepowershell.com/modules/integration-points/reports/authoring-reports#report-actions>) to delete specific items from the database.

```powershell
$databases = @{
  "master"="master"
  "core"="core"
}

$props = @{
  Parameters = @(
    @{Name="db"; Title="Choose a database"; Options=$databases; Tooltip="Choose one."}
  )        
  Title = "Option selector"
  Description = "Choose the right option."
  Width = 300        
  Height = 300        
  ShowHints = $true    
}    
$result = Read-Variable @props    
if ($result -ne "ok") {return}
[CentraalBeheer.Foundation.Platform.Providers.CustomCompositeDataProvider]$provider = [Sitecore.Configuration.Factory]::GetDatabase($db).GetDataProviders()[0]
[Sitecore.Data.DataProviders.ReadOnly.Protobuf.ProtobufDataProvider]$provider = $provider.ResourceDataProviders[0]
[Sitecore.Data.DataProviders.DataProvider]$dbprovider = $provider.DatabaseProvider
$database = [Sitecore.Configuration.Factory]::GetDatabase($db)
$connectionString = [System.Configuration.ConfigurationManager]::ConnectionStrings[$db]
$callContext = New-Object -TypeName "Sitecore.Data.DataProviders.CallContext, Sitecore.Kernel" -ArgumentList @($database.DataManager, $database.DataProviders.Count)
$sqlDataProvider = New-Object -TypeName "Sitecore.Data.SqlServer.SqlServerDataProvider, Sitecore.Kernel" -ArgumentList @($connectionString)
$items = @()
foreach($itemRecord in $provider.DataSet.Definitions.Values)
{        
  $id = New-Object -TypeName "Sitecore.Data.ID, Sitecore.Kernel" -ArgumentList @($itemRecord.ID)
  $itemDefinition = $sqlDataProvider.GetItemDefinition($id, $callContext)
  if($itemDefinition)
  {
    $items += Get-Item -Path $($db+":") -ID $id
  }     
}    
$items | Show-ListView -Property Name, DisplayName, ProviderPath, TemplateName, Language
```

## Conclusion

With just a small adjustment to Sitecore we can get much more insight into what is customized in the Sitecore database. The possibilities are endless. Another addition to this could be to make a notification in the content editor. Within this notification there can also be an action to delete the item.

> Code in this post is tested on Sitecore 10.2 only
