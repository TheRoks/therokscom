---
title: "Solving: CA0055 Could Not Load dll in Code Metrics"
path: "/solving-ca0055-load-dll-code-metrics/"
tags: ["dotNET"]
excerpt: "Recent in my project we had a problem with a TFS build when calculating the code metrics of the code. The error we ran into was the CA0055 Could not load file. Searching on the internet gave me some hints but not the solution in my case."
created: 2013-10-20
updated: 2013-10-20
---


Recent in my project we had a problem with a TFS build when calculating the code metrics of the code. The error we ran into was the CA0055 Could not load file. Searching on the internet gave me some hints but not the solution in my case.

## Situation

In my project we are working on a custom WCF service in SharePoint 2010 that will expose json. To expose Json we use the neat library JSON.Net. This is a really nice library to do a lot of customizations towards JSON input and output. To use this library we include the NuGet package of this library.

Because we believe in quality assurance we have TFS builds to do continious integration and daily builds. In them we calculate code metrics and write unittests on all our code.

## CA0055 Error The Cause

This error can have multiple causes. The assembly referred in the error message is not present. Or the assembly refers to an assembly that can not be loaded. It can cause some headache to find the problem.

In our case this error occurs in our TFS build when running the code metrics. What happened here is that we write the SharePoint code in .NET 3.5 and the unit tests in .NET 4.0. This is by default in Visual Studio 2010. Now the tricks happens. In our .NET 3.5 code the JSON.Net library of .NET 3.5 is referenced and in the unit test project the .NET 4.0 assembly. When putting all dll’s together for determining the code metrics the .NET 4.0 JSON.Net file is copied to the output folder. When loading the production dll is loaded, it fails to load because it’s only finding the JSON.Net 4.0 runtime dll. This won’t work and it fails to load the dll.

## Solution

Because we have our own NuGet server at our company, We copied the NuGet package to our NuGet server and removed the runtime version other than 3.5. In every project it now loads the .NET 3.5 JSON.Net assembly.
