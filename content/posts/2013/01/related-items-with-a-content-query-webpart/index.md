---
title: "Related items with a Content Query WebPart"
path: "/related-items-with-a-content-query-webpart"
tags: ["SharePoint"]
excerpt: "Working on an internet facing site there was a requirement to show frequently asked questions (FAQ’s) as related items to a page. The amount of FAQ’s is about 500."
created: 2013-01-12
updated: 2013-01-12
---

Working on an internet facing site there was a requirement to show frequently asked questions (FAQ’s) as related items to a page. The amount of FAQ’s is about 500.

## Solution

To have full control over the solution we decided to use a Content Query WebPart together with Managed Metadata. The managed metadata is one of my favorite service applications when it’s about content.

On the FAQ’s we can add managed metadata terms and on a Content Query WebPart there filtered on a PageFieldValue. This PageFieldValue needs to of the type Metadata and with the right configuration of the CQWP the solution is simple and needs no code.

## Setup Managed metadata

Define in the Managed metadata service application a termgroup that can will contain al terms on which we can relate items.

After that we can create a sitecolumn of the type metadata and bind it to the termgroup we just created. If you have trouble to create this column check my post on How to provision Managed Metadata columns.

Extend the contenttype of the page with this column. After this we have created a PageField of type Metadata. Filtering will be done over the values in this field.

## Configuring CQWP

Next step will be adding a Content Query WebPart to your page. There you can define a filter on the column you’ve added.

Managed metadata column in my case is able to contain more than one value. On the FAQ side as the page side as well. With this we create a many to many relationship. However filtering in this way is not possible with the edit box of the CQWP. So is it not possible? No!

We export the webpart. In the xml there are two elements that we must see. These are the properties; FilterOperator1 and FilterDisplayValue1. FilterDisplayValue1 has the right and expected value. However the FilterOperator1 has the value Eq. This will not do it. When multiple terms are coupled to a FAQ it will never appear in this result.

```xml
<property name="FilterOperator1"
  type="Microsoft.SharePoint.Publishing.WebControls.ContentByQueryWebPart+FilterFieldQueryOperator, Microsoft.SharePoint.Publishing, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c">
 Eq
</property>

<property name="FilterDisplayValue1" type="string">
 [PageFieldValue: Insurrance]
</property>
```

So we replace the `Eq` of `FilterOperator1` with `ContainsAny`, For the full reference on operators check this.

After the modifications we can upload the webpart to the webpart gallery. The webpart works as expected.

## Conclusion

This solution works for me. There are some thought you must take in … before using this. Configuring the CQWP is not a piece of cake and SharePoint will reset the ContainsAny if you make a change in the editor.

The CQWP is a very efficient webpart to grab data all over the site. However if your FAQ (or other content) is over your site, it has to query your whole site. This can be very inefficient. This solution works fast because all my FAQ’s are in one page library.
