---
title: "How to: NuGet package versioning"
path: "/nuget-package-versioning/"
tags: ["dotNET"]
excerpt: "Build automatically NuGet packages with a buildserver. Use there for the right versioning technique. It can save you a lot of troubles."
created: 2013-10-24
updated: 2013-10-24
---

NuGet, the package manager that is widely used in Visual Studio, has a lot of features that are really nice to use. However some things can be challenging. For example creating a NuGet package. It looks quite simple if you read the documentation on NuGet.org. Creating this in an automated process has some obstacles, like versioning.

## Build NuGet package

Building a NuGet package can be done in several ways. You can pack:

* NuSpec file, this is a file with all metadata about the package.
* Project file, it will generated a package off the assembly and content that the project will result in. Not everything that’s in the NuSpec file is supported in this way.
* Combined Project and NuSpec file, it will generated based on the project but will use the NuSpec file as well. NuSpec file is leading in this case.
In this post I’ll show how to pack based on the project file. Since NuGet 2.7 there’s a new feature calls Package Restore. In short it automatically check for the package availability in the packages folder. If the package is not available it will be downloaded from the NuGet stores.

By enableing this feature in your solution, there are created three new files in the virtual folder .nuget. NuGet.exe, NuGet.config, NuGet.targets. The contents of this last file is interesting. Besides enableing package restore you now have the possibility to build packages. In it is the pack command that’s necessary to build packages based on project files.

```powershell
$(NuGetCommand) pack "$(ProjectPath)" -Properties "Configuration=$(Configuration);Platform=$(Platform)" $(NonInteractiveSwitch) -OutputDirectory "$(PackageOutputDir)"
```

You can adjust this command. It’s well documented on NuGet.org

Looking in the targets file we also see this default values.

```xml
<!-- Enable the restore command to run before builds -->
<RestorePackages Condition="  '$(RestorePackages)' == '' ">false</RestorePackages>

<!-- Property that enables building a package from a project -->
<BuildPackage Condition=" '$(BuildPackage)' == '' ">false</BuildPackage>
```

What it says. When there’s no or an empty RestorePackages property in the project file use false as default. The same for BuildPackage. RestorePackages will be automatically added to the project files with NuGet packages. The build packages element is not added automatically.

Let’s do this, when you’re making a release build. Don’t forget to edit the output directory that’s configured in the targets file.

## Assembly mapping

Building packages with the project file and NuSpec file together, Where the NuSpec has a lot properties, some can be replaced by values of the assembly you are building. In the example below you can see the NuSpec file I’m using.

```xml
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2011/10/nuspec.xsd">
    <metadata>
        <id>$id$</id>
        <version>$version$</version>
        <title>$title$</title>
        <authors>$author$</authors>
        <description>$description$</description>
        <copyright>$copyright$</copyright>
    </metadata>
    <files>
        <file src="readme.txt" />
    </files>
</package>
```

These tokens will be replaced by assembly properties. The table below is from NuGet.org

| Token | Source |
| ----- |:------:|
| $id$ | The Assembly name |
| $version$ | The assembly version as specified in the assembly’s `AssemblyVersionAttribute`. |
| $author$ | The company as specified in the `AssemblyCompanyAttribute`. |
| $description$ | The description as specified in the `AssemblyDescriptionAttribute`. |

You can then edit this Nuspec file if you need to customize it. e.g. if you don’t want token replacement for some fields, you hard code then in the Nuspec instead.

Some properties can not be replace or automatically added without the Nuspec file. To show release notes in a readme.txt which can be placed in the root of a package, can only be added by reference it in a Nuspec file.

The Nuspec file will be automatically used when you put it next to the project file and with the same name as the project file.

## Version mapping

```csharp
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]
[assembly: AssemblyInformationalVersion("1.0.0")]
```

Basically, it comes down to this:

* If the AssemblyInformationalVersion attribute is available, then that one is used.
* If the AssemblyInformationalVersion attribute is not available, then the AssemblyVersion attribute is used.
* If none of the above are specified, your assembly will have a version number of 0.0.0.0, as well as the resulting package.
* NuGet totally ignores the AssemblyFileVersion attribute.
It should be noted that at the top level, NuGet deals with Packages rather than assemblies. Those packages in turn can bring in zero or more assemblies. The assembly versions may or may not match the package version, though is most cases they do.

## Version techniques

Now comes the part that’s not very clear on first sight. How to version these packages. There are several options to version a package.

## SemVer notation

What is SemVer? SemVer is short for semantic versioning. This versioning consists three parts. There is also a possibility to add some additional labels.

* Major – Breaking changes
* Minor – Backwards compatible API additions/changes
* Patch – Bugfixes not affecting the API
* PreRelease Tag – Alpha, Beta, … RC1, RC2, …
* Build – Build stamp, metadata,…
Possible version numbers in this version strategy are on precedence starting with the least important:

* 1.0.1-alpha001
* 1.0.1-beta013
* 1.0.1-RC1
* 1.0.1

## NuGet supported versioning

In NuGet versioning can be done in several ways. What ever you like and it’s possible. Let’s say almost. See in this table all possible versioning techniques that are supported

| SemVer | NuGet | | |
| ------------- |:-------------:| -----:|-----:|
| ✅ | ❌ | Versioning Scheme | Major.minor.patch[-prerelease][+build] |
| ✅ | ✅ | NuGet pre-release package | Major.minor.patch-prerelease |
| ✅ | ✅ | NuGet release package | Major.minor.patch |
| ❌ | ✅ | Legacy Versioning Scheme | Major.minor.build.revision |

The NuGet versioning algorithm is very close to the SemVer specification. By very close, I mean that NuGet follows SemVer in its entirety, except when it comes to build numbers. Because the SemVer specification is still a prerelease specification and the build number specification is still subject to change, the NuGet implementation doesn’t yet consider the build number in all cases.

The problem is that very close isn’t good enough. To apply proper semantic versioning and maintain a package upgrade path, you need to distinguish between release packages, pre-release packages and packages that are built during CI or nightly builds. In this article, I refer to nightly builds as integration packages, because they are created only to check whether the package is built correctly, preferably using a test client to check for integration errors.

It should be noted that the SemVer is not supported by default, but with some custom tailored build code, like a custom activity in TFS it’s possible to adapt this versioning scheme.

## Automated NuGet package build

### Never change the package ID

When changing the package ID, the upgrade path will be broken. Never do this!

### Split package repositories by audience

Don’t pollute consumers’ repository with your internal DEV builds.

After becoming a production version the pre-release tag can be removed and the package will be moved to a production location. This way its very clear that you are using pre-release versions.

### Never depend on NuGet.org

You shouldn’t depend directly on the NuGet.org Gallery feed if you want to have full control over what packages are consumed, available or approved for consumption in your organization, especially if you’re in a large corporate environment. Instead, mirror all the packages you need from the NuGet.org feed onto your own repository.

## Summary

NuGet versioning can be challenging but there’s always a solution. After all NuGet isn’t a solution for solving a problem, but a way to solve one.

Read also: [Anti patterns on MSDN](http://msdn.microsoft.com/en-us/magazine/jj851071.aspx)

This article is written when NuGet version 2.7 is the current version. Versions of NuGet do follow up rapidly so if you are on a newer version things may differ as described above.
