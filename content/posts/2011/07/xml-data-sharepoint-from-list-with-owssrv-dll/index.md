---
title: "XML data from SharePoint list with owssrv.dll"
path: "/xml-data-sharepoint-from-list-with-owssrv-dll/"
tags: ["SharePoint"]
excerpt: "While working on a project I needed to create a InfoPath form a nested repeated table that will be filled with data from a SharePoint list."
created: 2011-07-20
updated: 2011-07-20
---

While working on a project I needed to create a InfoPath form a nested repeated table that will be filled with data from a SharePoint list.

This cannot be done by simple bindings. This can be done by using code behind and a data connection to a XML file. This XML file is provided by the `owssvr.dll`. It is part of FP-RPC (Front Page – Remote Procedure Call) but should not be confused with Front Page extensions.

1. Set up a view for the SharePoint list that will return all data that you will need. The view has many nice features like choose columns, sorting and filtering.
2. Instead of adding the connection to the list as a sharepoint library connection, we will instead add it as a XML connection, and point it to a url that will allow us to filter the list. `http://{Site}/_vti_bin/owssvr.dll?Cmd=Display&List={ListGuid}&View={ViewGuid}&XMLDATA=TRUE`
3. Go back to InfoPath

  * Add a new datasource
  * Receive Data
  * XML Document
  * Paste the path we constructed above, choose “Access the data from the specified location”
  * Give the data connection a name and clear the “Automatically retrieve data when form is opened”

4. In the code-behind of the InfoPath form, the DataSources property can be accessed to retrieve the XML of the view.
5. Loop through the records in de DataSource to extend the DOM of the InfoPath form.

Note: InfoPath 2010 will by default publish as a Sandbox Solution, therefore the form need Full Trust when using the DataSources in the code-behind. InfoPath 2010 will not enable this by default.