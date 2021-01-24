---
title: "How to add icon to represent PDF documents"
path: "/how-to-add-icon-to-represent-pdf-documents/"
tags: ["SharePoint"]
excerpt: "How to add an icon to SharePoint 2010 to represent Adobe PDF documents that are stored in document libraries. See how with the DocIcon.xml"
created: 2013-01-18
updated: 2013-01-18
---

We have a website with a lot of PDF documents. In content hyperlinks are made to these documents. The design that is given us, says we need to show a PDF icon in front the hyperlink. SharePoint has an option with hyperlinks to show a pictogram in front of a hyperlink. But there’s no default support for PDF icons. I’ll show how to add the PDF icon.

## Solution with DocIcon

To specify the .gif file that you want to use for the icon that represents Adobe PDF documents that are stored in SharePoint document libraries, follow these steps:

* Copy the .gif file that you want to use for the icon to the following folder on the server:
Drive:Program FilesCommon FilesMicrosoft SharedWeb Server Extensions14TEMPLATEIMAGES

* Edit the Docicon.xml file to include the .pdf file name extension. To do so:
  * Start Notepad, and then open the Docicon.xml file. The Docicon.xml file is located in one of the following folders on the server:
    Drive:Program FilesCommon FilesMicrosoft SharedWeb Server Extensions14TEMPLATEXML

  * In the `<ByExtension>` section of the Docicon.xml file, add an entry for the .pdf file name extension. To do so, add the following line, where NameofIconFile is the name of the .gif file: `<Mapping Key=”pdf” Value=”NameofIconFile.gif”/>` For example, if the name of the .gif file is MyPicture.gif, add the following line: `<Mapping Key=”pdf” Value=”MyPicture.gif”/>`
  * On the File menu, click Save, and then exit Notepad.
After this there’s a IIS restart necessary to see this change working.

__Changes to DocIcon.xml should be made with extreme caution because they are global to a Windows SharePoint Services deployment and affect all site definitions on the front-end Web server. Changes that you make to this file may be overwritten when you install updates or service packs to Windows SharePoint Services, or when you upgrade an installation to the next product version.__

For full documentation on DocIcon.xml see [MSDN](http://msdn.microsoft.com/en-us/library/ms463701(v=office.12).aspx)
