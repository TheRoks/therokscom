---
title: "XSLT remove HTML comments / attributes / nodes"
path: "/xslt-remove-html-comments-attributes-nodes"
tags: ["SharePoint"]
excerpt: "Working on a new SharePoint site, we have to migrate old content to our new SharePoint. The old site was built in Tridion. To clean up HTML, the use of XSLT nifty way to clean things up."
created: 2012-06-27
updated: 2012-06-27
---

Working on a new SharePoint site, we have to migrate old content to our new SharePoint. The old site was built in Tridion. To clean up HTML, the use of XSLT nifty way to clean things up.

## Content migration

Content migration will be done with the application called Metalogix. This is a very powerful application. It works based on screen scraping. With XPath expressions content can be extracted to sitecolumns. This works like a charm, but when the design and HTML of a site changes, there’s a lot of rubbish in the HTML left behind.


## Inconvenient old HTML

To get clean HTML there’s a possibility to apply a XSL stylesheet to ripped parts of HTML. So what kinds of HTML are rubbish.

* Inline styling, this is never a good idea, always use css classes
* Css classes, new design means in our case new css classes so all css classes in content can be removed.
* Previous point is somewhat overdone. In some cases the old class can be replaced by a new one. So there is need to replace attribute values.
* Remove comments. The site we are migrating uses ReadSpeaker. ReadSpeaker uses HTML comments to determine, what is relevant. In our SharePoint site we placed this comments in the PageLayouts.

## Solution with XSLT

All problems can be solved by writing a XSLT stylesheet. This is the stylesheet I’ve used.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- Remove unwanted attributes or/and nodes -->
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format">
  <xsl:output method="xml" encoding="UTF-8" indent="yes"/>

  <!-- Copy everything -->
  <xsl:template match="@*|node()|text()|processing-instruction()">
     <xsl:copy>
       <xsl:apply-templates select="@*|node()|text()|processing-instruction()"/>
     </xsl:copy>
  </xsl:template>

  <xsl:template match="@class[.='imageBlock Left']">
    <xsl:attribute name="class">
      <xsl:value-of select="'ms-rtePosition-1'"/>
    </xsl:attribute>
   </xsl:template>

   <xsl:template match="@class[.='imageBlock Right']">                
     <xsl:attribute name="class">
       <xsl:value-of select="'ms-rtePosition-2'"/>
     </xsl:attribute>
   </xsl:template>

   <!-- To remove attributes or nodes, 
        simply write a matching template that doesn't do anything. 
        Therefore, it is removed -->
   <xsl:template match="@class"/><!-- Remove all id_1 attributes -->
   <xsl:template match="@id"/>
   <xsl:template match="@style"/>
   <xsl:template match="comment()"/>    

</xsl:stylesheet>
```

The code is inspired on this piece.