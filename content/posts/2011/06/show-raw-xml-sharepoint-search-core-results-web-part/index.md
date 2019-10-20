---
title: "SharePoint search core results web part"
path: "/show-raw-xml-sharepoint-search-core-results-web-part/"
tags: ["SharePoint"]
excerpt: "Developing a custom xslt for the search core results web part can be hard. It’s very helpfull to have xml to test it on. To view the raw xml use this xsl in SharePoint Enterprise Search."
created: 2011-06-11
updated: 2011-06-11
---


Developing a custom xslt for the search core results web part can be hard. It’s very helpfull to have xml to test it on. To view the raw xml use this xsl in SharePoint Enterprise Search.

```xml
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
 <xmp><xsl:copy-of select="*"/></xmp>
 </xsl:template>
</xsl:stylesheet>
```
