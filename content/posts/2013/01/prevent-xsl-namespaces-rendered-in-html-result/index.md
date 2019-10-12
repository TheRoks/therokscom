---
title: "Prevent XSL namespaces to be rendered in result"
path: "prevent-xsl-namespaces-rendered-in-html-result"
tags: ["SharePoint"]
excerpt: "Working on a SharePoint 2010 site we had a requirement to make the site HTML5 valid. To test this we use the W3C validator on internet. After a lot of improvements we got stuck with just these kind of errors."
created: 2013-01-08
updated: 2013-01-08
---

Working on a SharePoint 2010 site we had a requirement to make the site HTML5 valid. To test this we use the W3C validator on internet. After a lot of improvements we got stuck with just these kind of errors.

Attribute xmlns:ddwrt not allowed here.
Attribute with the local name xmlns:ddwrt is not serializable as XML 1.0.

This attribute was rendered in HTML that was produced by a Content Query WebPart (CQWP). A content query webpart uses several XSL files to render HTML. These XSL files were customized but there was not valid HTML any more.

## In Depth

When using a XSLT stylesheet to transform a XML file you can use different XSL namespace to perform several special functions i.e. DateTime functions. Without adding these namespaces in the XSL file the functions won’t work.

```xml
<xsl:stylesheet version="1.0" 
 xmlns:x="http://www.w3.org/2001/XMLSchema"
 xmlns:d="http://schemas.microsoft.com/sharepoint/dsp"
 xmlns:cmswrt="http://schemas.microsoft.com/WebParts/v3/Publishing/runtime"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:msxsl="urn:schemas-microsoft-com:xslt"
 xmlns:ddwrt="http://schemas.microsoft.com/WebParts/v2/DataView/runtime">
```

## The Problem

By just adding the namespace will also result in a namespace in the result. In my case HTML.

```xml
<h2 xmlns:ddwrt="http://schemas.microsoft.com/WebParts/v2/DataView/runtime">
    Header text
</h2>
```

## Solution
To prevent the namespace to be rendered in the result we can add an attribute to the stylesheet element. Exclude-result-prefixes.

The value is a white-space-separated list of namespace prefixes. The namespace bound to each of the prefixes is designated as an excluded namespace. The default namespace (as declared by `xmlns`) may be designated as an excluded namespace by `including#default` in the list of namespace prefixes. The designation of a namespace as an excluded namespace is effective within the subtree of the style sheet rooted at the element bearing the `exclude-result-prefixes;` a subtree rooted at an `<xsl:stylesheet>` element does not include any style sheets imported or included by children of that `<xsl:stylesheet>` element.

```xml
<xsl:stylesheet version="1.0" 
 exclude-result-prefixes="x d xsl msxsl cmswrt ddwrt"
 xmlns:x="http://www.w3.org/2001/XMLSchema"
 xmlns:d="http://schemas.microsoft.com/sharepoint/dsp"
 xmlns:cmswrt="http://schemas.microsoft.com/WebParts/v3/Publishing/runtime"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:msxsl="urn:schemas-microsoft-com:xslt"
 xmlns:ddwrt="http://schemas.microsoft.com/WebParts/v2/DataView/runtime">
 ```

After that the HTML will be clean and look like this

```xml
<h2>Header text</h2>
```

For more information on the xsl:stylesheet element see [MSDN](http://msdn.microsoft.com/en-us/library/ms256204.aspx)
