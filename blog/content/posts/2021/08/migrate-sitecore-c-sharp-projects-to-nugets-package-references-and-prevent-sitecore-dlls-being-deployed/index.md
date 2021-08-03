---
title: "Migrate Sitecore C# projects to NuGet package references and deploy without Sitecore shipped dlls"
path: "/migrate-sitecore-C-sharp-projects-to-nuget-package-references-and-deploy-without-sitecore-shipped-dlls/"
tags: ["Sitecore", "NuGet"]
excerpt: Create an easy way to manage NuGet package versions in Sitecore solutions and keep deployments clean.
created: 2021-08-03
updated: 2021-08-03
featuredImage: "./sitecore-packagereference.png"
---

Working with a large Sitecore solution, i.e. more than 150 C# projects, it can be hard and a lot of work to update NuGet packages. I'll explain here in short what you can do to make life easier.

## Central Manage PackageReference versions

A typical Sitecore solution contains many C# projects. Especially when following the Helix structure. A common problem that usually appears when the number of projects begins to pile up inside a single solution is maintaining consistency between NuGet versions, and quite some times you end up with every project using a different version of the same package. All kinds of validation scripts for this could prevent this. However, solving this problem at the front door is even better. Manage the versions inside the solution at a central point.

### PackageReference per project

To create this central point create packages.props at the root level of the solution.

This could look like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <PlatformVersion>10.0.1</PlatformVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Update="Sitecore.Mvc"                 Version="$(PlatformVersion)" />
    <PackageReference Update="Sitecore.Personalization.Mvc" Version="$(PlatformVersion)" />
    <PackageReference Update="Sitecore.ContentSeach"        Version="$(PlatformVersion)" />
  </ItemGroup>
</Project>
```

In each project (csproj) you add the packages you're going to use without the version

```xml
<ItemGroup>
  <PackageReference Include="Sitecore.Mvc" />
  <PackageReference Include="Sitecore.Personalization.Mvc" />
  <PackageReference Include="Sitecore.ContentSearch" />
</ItemGroup>
```

If someone attempts to add a version inside a csproj, he will get a build error:

```text
The package reference 'Sitecore.ContentSearch' should not specify a version.  Please specify the version in 'C:\git\mysolution\Packages.props' or set VersionOverride to override the centrally defined version.
```

### Global PackagesRefences

The next step in making things easier is using the global package refences feature. As its name says, these packages references are defined once and automatically included in all projects without defining them in the projects (csproj).

You can add a Global Package References in the `packages.props`

```xml
<ItemGroup>
  <GlobalPackageReference Include="Sitecore.Kernel" Version="$(PlatformVersion)" />
  <GlobalPackageReference Include="Sitecore.Assemblies.Platform" Version="$(PlatformVersion)" />
</ItemGroup>
```

Sitecore.Kernel is a typical package you'll need in every Sitecore project. It's a good example to include globally.

## PackageReference quirks

When migrating to package references there are a few caveats to take into account. Package references acts differently with content files and transformations. These cannot be used as before. When you have these kinds of NuGet packages, please read more about [these cases](https://docs.microsoft.com/en-us/nuget/consume-packages/migrate-packages-config-to-package-reference#package-compatibility-issues).

Another almost hidden feature is you can specify the behavior of the referenced packages. With the line `<PackageReference Include="Sitecore.Kernel" />` in a project. Every project that references this project will also include this package in a hidden way. You won't see this in Visual Studio, but it will compile! To make it more explicit use the attribute `PrivateAssets`. When you change the line to `<PackageReference Include="Sitecore.Kernel" PrivateAssets="all" />` won't propagate the dlls in this package to referencing projects. While this is an option I do not choose to do this when working on a large Sitecore solution where everything is combined in the end. Another advantage is that you won't see any Microsoft.AspNet packages because they are indirectly referenced by Sitecore.Mvc package. So you only need to know which version of Sitecore you're working on and all other packages will be included automatically.

## Clean deployments

Now we have a simple way to include NuGet packages, we also easily can make the change to create clean deployments. From our custom solution, we never want to override Sitecore's out-of-the-box dlls. To achieve this, there are just a few steps to take.

### Sitecore assemblies NuGet packages

To make this migration even more powerful we include `Sitecore.Assemblies.Platform` as global package reference. Every project now has this package automatically referenced.
This NuGet package provides the SitecoreAssemblies item group for assemblies that ship with the main Sitecore platform roles (CM/CD/etc), which should be excluded from deployment.

### MSBuild Publishing props and targets

The item group can be used when deploying your solution to a folder. This can be done by using a publishing profile file, which refers to a central file. The contents of the centrally managed file will be like this.

```xml
<Project ToolsVersion="4.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <ItemGroup>
        <ExcludeFromPackageFiles Include="@(SitecoreAssemblies -> 'bin\%(Filename)%(Extension)')" />
        <ExcludeFromPackageFiles Include="@(SitecoreAssemblies -> 'bin\%(Filename).pdb')" />
        <ExcludeFromPackageFiles Include="@(SitecoreAssemblies -> 'bin\%(Filename).xml')" />
    </ItemGroup>
    <PropertyGroup>
        <publishUrl>https://sc1010.dev.local</publishUrl>
        <ExcludeFilesFromDeployment>
            @(ExcludeFromPackageFiles);
            web.config;
            bin\roslyn\**;
        </ExcludeFilesFromDeployment>
        <IncludeSetACLProviderOnDestination>False</IncludeSetACLProviderOnDestination>
    </PropertyGroup>
</Project>
```

By combining the GlobalPackage reference of Sitecore.Assemblies.Platform and the central managed publishing profile configuration non of the projects will ever deploy a dll that is shipped by Sitecore.

## Cleaning things up

As a result of this, you're able to clean your project files with a lot of clutter. All file references to the packages folder are removed, that include analyzers, dlls, and build targets files. Instead, we add just a few package reference lines.

Next, we delete the packages.config files. Don't forget these. Things will break if you don't.
If you are still using a wpp.targets file. It won't be needed anymore for excluding Sitecore assemblies you do not want to deploy.

Happy Sitecore-ing!
