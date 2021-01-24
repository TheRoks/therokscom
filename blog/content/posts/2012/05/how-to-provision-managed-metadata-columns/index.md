---
title: "How to provision Managed Metadata columns"
path: "/how-to-provision-managed-metadata-columns/"
tags: ["SharePoint"]
excerpt: "This post will show you how to provision Site Columns that uses Managed Metadata in SharePoint 2010 with a custom activation feature."
created: 2012-05-06
updated: 2012-05-06
---

This post will show you how to provision Site Columns that uses Managed Metadata in SharePoint 2010. Managed Metadata is one of the new and exciting features of SharePoint Server 2010. It allows you to centrally manage metadata terms and keywords. Creating Managed Metadata columns using the SharePoint web interface is a simple task but the problem is that it does not allow you to move your Site Columns from one farm to another that easily. The reason is that these Site Columns definitions contains references to the unique IDs of the terms in the current Managed Metadata Service Application (MMS).

## What to do

To provision the Site Columns and Content Types without these hardcoded Guids and IDs you basically have two options:

* Create an event receiver (or similar) that creates the Site Columns and Content Types programmatically
* A combination of declarative and the programmatic approach above

First you need to create a new SharePoint 2010 project in Visual Studio 2010, create a new Empty SharePoint project. Then add a new Content Type SharePoint Project Item (SPI) to the project and inherit it from the Item content type. Then add a new XML file to the SPI and name it Fields.xml. This elements manifest will contain the Site Column definition, but in order to make it into a manifest file you need to select the file and press F4 to edit the properties of the file. Change the Deployment Type from NoDeployment to ElementManifest. Your solution should look like the image to the right. Also make sure to set the feature to be scoped to Site (Site Collection) level – we’re talking about deploying Site Columns and Content Types here.

Then it is time to write the declarative part (i.e. the XML). You need to add a new Field element of the type TaxonomyFieldType (or TaxonomyFieldTypeMulti). Configure it as follows or as it suits your needs. Notice that I have set the ShowField attribute to Term1033, this is needed by the MMS to select the correct term value.

```xml
<xml version="1.0" encoding="utf-8" ?>
<Elements xmlns="http://schemas.microsoft.com/sharepoint/">
  <Field ID="{749DA0D1-4649-4C25-871B-05F0C07221FC}"
         Type="TaxonomyFieldType"
         DisplayName="Country"
         ShowField="Term1033"
         Required="TRUE"
         EnforceUniqueValues="FALSE"
         Group="_Custom"
         StaticName="Country"
         Name="Country"/>
</Elements>
```

That’s all that you can do declarative. If this would be deployed a field would be created of the type Managed Metadata but you have to manually connect it to the MMS.

Now we have to dig into some programming to connect the field to the MMS. This is done in an Event Receiver for the feature. Right-click the feature and select Add Event Receiver. Uncomment the FeatureActivated method and implement it as follows:

```csharp
public override void FeatureActivated(SPFeatureReceiverProperties properties)
{
     SPSite site = properties.Feature.Parent as SPSite;
     Guid fieldId = new Guid("{749DA0D1-4649-4C25-871B-05F0C07221FC}");
     if (site.RootWeb.Fields.Contains(fieldId))
     {
         TaxonomySession session = new TaxonomySession(site);
         if (session.TermStores.Count != 0)
         {
              var termStore = session.TermStores["Managed Metadata Service"];
              var group = termStore.Groups.GetByName("TheRoks Group");
              var termSet = group.TermSets["Continents"];
              TaxonomyField field = site.RootWeb.Fields[fieldId] as TaxonomyField;
              // Connect to MMS
              field.SspId = termSet.TermStore.Id;
              field.TermSetId = termSet.Id;
              field.TargetTemplate = string.Empty;
              field.AnchorId = Guid.Empty;
              field.Update();
         }
     }
}
```

This method will first check if the field has been deployed. The field is retrieved using the Guid of the Field, defined in the XML. Once that is confirmed that the field exists a TaxonomySession object is acquired using the SPSite object. The TaxonomySession object is declared in the Microsoft.SharePoint. Taxonomy assembly – so you have to add a reference to that assembly first. To connect the field to the MMS you need to retrieve the Term Store, Group and Term Set. All this is done using the names of them as defined in the MMS. The image to the right shows how the MMS looks like that this code is connecting the field to. It is very likely that you have the same structure of the MMS in your different environments – if not you have to come up with a more configurable way.
Note: the GetByName method used above is a custom extension that looks like this:

```csharp
public static Group GetByName(this GroupCollection groupCollection, string name)
{
     if (String.IsNullOrEmpty(name))
     {
         throw new ArgumentException("Not a valid group name", "name");
     }
     foreach (var group in groupCollection)
     {
         if (group.Name == name)
         {
             return group;
         }
     }
     throw new ArgumentOutOfRangeException("name", name, "Could not find the group");
}
```

Once you have a hold on the taxonomy objects then it is time to convert the Field to a TaxonomyField object. This object is then configured with a set of properties. Specifically the ID of the Term Store and Term Set is set. Finally the field is updated to reflect the changes.
