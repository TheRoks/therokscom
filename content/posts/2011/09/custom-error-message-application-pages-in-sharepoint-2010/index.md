---
title: "Custom Error/Message Application Pages in SharePoint 2010"
path: "/custom-error-message-application-pages-in-sharepoint-2010"
tags: ["SharePoint"]
excerpt: "In SharePoint 2010 it is possible to replace several application pages. This are: AccessDenied , Confirmation, Error, Login, RequestAccess, Signout, WebDeleted. This can be done in two ways. By using a eventreceiver or a Powershell script."
created: 2011-09-16
updated: 2011-09-16
---

In SharePoint 2010 it is possible to replace several application pages. This are: AccessDenied , Confirmation, Error, Login, RequestAccess, Signout, WebDeleted. This can be done in two ways. By using a eventreceiver or a powershell script.

```csharp
public class AccessDeniedEventReceiver : SPFeatureReceiver
{
  const string CustomAccessDeniedPage =
                  "/_layouts/../AccessDenied.aspx";
  public override void FeatureActivated(
                         SPFeatureReceiverProperties properties)
  {
     if (properties != null)
     {
        SPWebApplication webApplication =
          properties.Feature.Parent as SPWebApplication;
        if (webApplication != null)
        {
           if (webApplication.UpdateMappedPage(
                 SPWebApplication.SPCustomPage.AccessDenied,
                 CustomAccessDeniedPage))
           {
             webApplication.Update();
           }
        }
     }
  }

  public override void FeatureDeactivating(
                         SPFeatureReceiverProperties properties)
  {
    if (properties != null)
    {
       SPWebApplication webApplication =
          properties.Feature.Parent as SPWebApplication;
       if (null != webApp)
       {
          if (webApp.UpdateMappedPage(
               SPWebApplication.SPCustomPage.AccessDenied,null))
          {
             webApp.Update();
          }
       }
    }
  }
}
```

Another way to do this is by using Powershell. The command `Set-SPCustomLayoutsPage` enables you to map a custom page. I.E.

```powershell
Set-SPCustomLayoutsPage -Identity "AccessDenied" -RelativePath "/_layouts/custompages/accessdenied.aspx" -WebApplication "{replace with web app url}"
```

For more details on this command check [MSDN](http://technet.microsoft.com/en-us/library/ff607768.aspx)

The eventreceiver has the advantage it is deployed with a feature, so you can deliver the custom page with that. The Powershell commands can be executed by an administrator and needs no code.
