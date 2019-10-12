---
title: "Failed to extract the cab file in the solution"
path: "failed-extract-cab-file-solution"
tags: ["SharePoint"]
excerpt: "Sometimes you want to find all content types and sitecolumns you created in SharePoint. A simple way to acomplish this is the use of PowerShell. Conditional in this script is that all my custom content types and sitecolumns belong to the same group."
created: 2012-06-19
updated: 2012-06-19
---

## The problem: Failed to extract the cab file in the solution

Working on a SharePoint where I was reshuffling some files, suddenly I run into this error while attempting to add a solution to the solution store: Failed to extract the cab file in the solution.

## Solution

For me the solution was very simple. One of the files had dubble dot before the extension in the file name. Removing the dot solved the problem. It seems that not only double dots, but also parentheses can cause the same error. This is documented on [MSDN](http://msdn.microsoft.com/en-us/library/ee330922.aspx).
