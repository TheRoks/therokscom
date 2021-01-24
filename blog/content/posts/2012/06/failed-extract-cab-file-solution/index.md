---
title: "Failed to extract the cab file in the solution"
path: "/failed-extract-cab-file-solution/"
tags: ["SharePoint"]
excerpt: "See here how I solved the error during Add Solution: failed to extract the cab file in the solution error. This was by incorrect filenames."
created: 2012-06-19
updated: 2012-06-19
---

## The problem: Failed to extract the cab file in the solution

Working on a SharePoint where I was reshuffling some files, suddenly I run into this error while attempting to add a solution to the solution store: Failed to extract the cab file in the solution.

## Solution

For me the solution was very simple. One of the files had double dot before the extension in the file name. Removing the dot solved the problem. It seems that not only double dots, but also parentheses can cause the same error. This is documented on [MSDN](http://msdn.microsoft.com/en-us/library/ee330922.aspx).
