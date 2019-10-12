---
title: "Solving: Attempted to use an object that has ceased to exist."
path: "solving-attempted-to-use-an-object-that-has-ceased-to-exist"
tags: ["SharePoint"]
excerpt: "Sometimes in SharePoint you get errors that were not very clear when you start. However if you develop for some time in SharePoint you’ll learn the best practices and you will avoid some simple mistakes. One of these errors is Attempted to use an object that has ceased to exist."
featuredImage: "./attempted-to-use-an-object-that-has-ceased-to-exist.png"
created: 2015-07-06
updated: 2015-07-06
---

Sometimes in SharePoint you get errors that were not very clear when you start. However if you develop for some time in SharePoint you’ll learn the best practices and you will avoid some simple mistakes. One of these errors is: Attempted to use an object that has ceased to exist. `(Exception from HRESULT: 0x80030102 (STG_E_REVERTED))`

The error message `Attempted to use an object that has ceased to exist. (Exception from HRESULT: 0x80030102 (STG_E_REVERTED))` occurs when you dispose the SPWeb object in SharePoint. When once disposed it is never accessible anymore.

You should look in your code for

```csharp
(SPWeb site = SPContext.Current.Site) {…}
```

The solution is to replace this by

```csharp
using (SPWeb elevatedSite = elevatedsiteColl.OpenWeb(siteID)) { … }

Guid siteID = SPContext.Current.Web.ID;
```

For further reading about best practices disposing SharePoint services object, [read this post on MSDN](https://msdn.microsoft.com/en-us/library/aa973248(v=office.12).aspx)
