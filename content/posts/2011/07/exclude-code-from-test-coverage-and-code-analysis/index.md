---
title: "Exclude code from test coverage and code analysis"
path: "/exclude-code-from-test-coverage-and-code-analysis/"
tags: ["dotNET"]
excerpt: "When working with generated code, I don’t want this to affect my code coverage, code metrics or code analysis. All these statistics are interesting over code that really matters. To exclude generated code from these statistics you can use a few attributes."
created: 2011-07-08
updated: 2011-07-08
---


When working with generated code, I don’t want this to affect my code coverage, code metrics or code analysis. All these statistics are interesting over code that really matters. To exclude generated code from these statistics you can use a few attributes.

GeneratedCodeAttribute, this will exclude the code for code metrics and code analysis. It had no effect on the code coverage.

ExcludeFromCodeCoverage, DebuggerNonUserCode and DebuggerHidden, this will exclude the code from code code coverage.

1. **ExcludeFromCodeCoverage** is available since .NET 4. Use this one when excluding code that you’ve writing yourself.
2. **DebuggerNonUserCode**, use this one when the code is generated and still must be debuggable.
3. **DebuggerHidden**, use this attribute when the code is generated and you want to disable stepping through the code when debugging.

Reading you will question do I need to change the a generated file that possibly will be regenerated? I think so. It is the responsibility of the tool that generates the code to add these attributes.
