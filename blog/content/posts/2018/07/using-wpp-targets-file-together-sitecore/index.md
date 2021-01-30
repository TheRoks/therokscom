---
title: "Using the wpp.targets file together with Sitecore"
path: "/using-wpp-targets-file-together-sitecore/"
tags: ["Sitecore"]
excerpt: "A brief description on how to use the wpp.targets file in a Visual Project to keep your webdeploy packages clean."
featuredImage: "./wpptarget-with-sitecore-deployment.png"
created: 2018-07-13
updated: 2018-07-13
---

When working on Sitecore and deploying modules to a Sitecore site we only want to deploy artifacts that are ours and not from Sitecore. This way we want to keep the deployment packages clean and fast. To manage the contents and behaviors of deployment packages we can use a wpp.targets file.

## The project setup

We use Unicorn to serialize Sitecore items. These yml files are not included in the Visual Studio project. In the development environment these live in a git repository (e.g. c:\git\mysite\..\serialization\..), in the Sitecore instance they live in the App_Data folder.

Deployments with webdeploy, will set up the security descriptors (ACL) by default. This is mostly not needed and a relative slow process during deployment. This could be skipped.

With Sitecore we use patch files to adjust the behavior of Sitecore. We also use some patch files to adjust Sitecore in a development environment e.g. set the serialization path to the c:\git\mysite\..\serialization\.. folder and patch out some pipelines that should only be used in a production environment.

On a local development environment we use Web Publishing to an IIS site within Visual Studio and on the test, acceptance and production environment we use Webdeploy.

## Wpp.targets file to the rescue

When you want to configure settings that apply to all profiles you use in a project, you create a .wpp.targets file. The .wpp.targets file must be located in the project folder and must be named `<projectname>.wpp.targets`.

Create a new XML file in the project folder (the same folder that holds the .csproj file) and name it
`<projectname>.wpp.targets`.
Create a Project element as the top-level element, and within it create a PropertyGroup element.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Project ToolsVersion="4.0"
   xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
  </PropertyGroup>
</Project>
```

## Keeping the deployments clean

To exclude files and folders in local deployment and webdeploy we use the element ExcludeFilesFromDeployment.

This element is set within the PropertyGroup

```xml
<PropertyGroup>
  <!-- Files that may not be deployed at all -->
  <ExcludeFilesFromDeployment>
  TheRoks.Project.Website.wpp.targets;
  bin\*.Foundation.*;
  bin\*.Feature.*;
  bin\RazorGenerator.Mvc.*;
  bin\Microsoft*;
  bin\roslyn\**;
  bin\Sitecore.*;
  bin\System.*.dll;
  bin\EcmaScript.NET.*;
  bin\HtmlAgilityPack.dll;
  bin\ICSharpCode.SharpZipLib.*;
  bin\*Iesi.Collections.dll;
  bin\Newtonsoft.Json.dll;
  bin\*RazorGenerator.Mvc.dll;
  bin\WebActivatorEx.*;
  packages.config;
  web.config;
  </ExcludeFilesFromDeployment>
</PropertyGroup>
```

To exclude files from packaging to the webdeploy packages, but still deploy to the local development environment with Visual Studio we use the element ExcludeFromPackageFiles. This is set within an ItemGroup element.

```xml
<ItemGroup>
  <ExcludeFromPackageFiles Include="**\*._DevSettings.config">
  <FromTarget>DevSettings files</FromTarget>
  </ExcludeFromPackageFiles>
</ItemGroup>
```

To skip the security descriptors (ACL) we add the IncludeSetACLProviderOnDestination with value false in the propertygroup.

```xml
<IncludeSetACLProviderOnDestination>
  False
</IncludeSetACLProviderOnDestination>
```

Now we only need to add our Unicorn yml files to the deployment package. We do not deploy them in a local development environment, because the local Sitecore development configuration (within the DevSettings.config) directs them to a c:\git\mysite\..\serialization\..

First off all we define the files to include

```xml
<Target Name="DefineCustomFiles">
  <ItemGroup>
    <CustomSerializationFilesToInclude Include="..\serialization\**\*" />
  </ItemGroup>
</Target>
```

We define the location where to deploy the files.

```xml
<Target Name="CustomCollectFiles">
<ItemGroup>
  <FilesForPackagingFromProject Include="@(CustomSerializationFilesToInclude)">
  <DestinationRelativePath>App_Data/Unicorn/%(RecursiveDir)%(Filename)%(Extension)</DestinationRelativePath>
  </FilesForPackagingFromProject>
</ItemGroup>

</Target>
  <PropertyGroup>
    <CopyAllFilesToSingleFolderForPackageDependsOn>
      DefineCustomFiles;
      CustomCollectFiles;
      $(CopyAllFilesToSingleFolderForPackageDependsOn);
    </CopyAllFilesToSingleFolderForPackageDependsOn>
    <CopyAllFilesToSingleFolderForMsdeployDependsOn>
      DefineCustomFiles;
      CustomCollectFiles;
    $(CopyAllFilesToSingleFolderForPackageDependsOn);
  </CopyAllFilesToSingleFolderForMsdeployDependsOn>
</PropertyGroup>
```
