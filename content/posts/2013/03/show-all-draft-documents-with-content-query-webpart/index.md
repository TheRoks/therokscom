---
title: "Show All Draft Documents with Content Query WebPart"
path: "show-all-draft-documents-with-content-query-webpart"
tags: ["SharePoint"]
excerpt: "SharePoint has the capability to show all checkout page of web. Manage Content and Structure has several built-in filters like: All Draft Documents and Checked Out to Me."
created: 2013-03-22
updated: 2013-03-22
---


SharePoint has the capability to show all checkout page of web. Manage Content and Structure has several built-in filters like: All Draft Documents and Checked Out to Me. This filter options can be extended by defining a CAML query in the list Content and Structure Reports list. However this has drawbacks. It is not possible to do this over multiple webs or even a site collection.

## How to solve

There are many options to solve this problem. This can be done by coding a webpart or running a Powershell. The easyest way to do it is by using a out-of-the-box artifacts of SharePoint. The most powerfull webpart without a doubt is the Content Query WebPart. This webpart has a lot of options in the web interface of SharePoint but beneath is xml where even much options are available. Here we can create the webpart we need.

## Configure a Content Query WebPart

This starts simple take a export of a out-of-the-box Content Query WebPart. After that we start editing the webpart. First of all we replace the property QueryOverride.

```xml
<Where><Eq><FieldRef ID="{fdc3b2ed-5bf2-4835-a4bc-b885f3396a61}"></FieldRef><Value Type="Number">3</Value></Eq></Where><OrderBy><FieldRef Name='CheckoutUser'/></OrderBy>
```

Next thing we want is to group the items by the user that has files checked out.

```xml
<property name="GroupBy" type="user">CheckoutUser</property>
```

In addition to that line we also replace GroupByFieldType

```xml
<property name="GroupByFieldType" type="user"></property>
```

The CAML query can return all sorts of data about the pages in its result set. The CQWP displays the name and description by default. We want the Checkout User for our title, and the last modified date of the page.

```xml
<property name="CommonViewFields" type="string">Modified,Text;CheckoutUser,User</property>
```

## Tips

One thing not mentioned above is the lists which where covered by the CQWP. This can be configured by the web-interface. Using a CQWP over the full site collection can decrease the performance over the page. So be carefull when configuring a Content Query WebPart.

See also [MSDN](http://msdn.microsoft.com/en-us/library/aa981241.aspx) on how to customize the Content Query WebPart.
