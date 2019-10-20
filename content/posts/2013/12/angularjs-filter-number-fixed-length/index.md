---
title: "AngularJS Filter Number Fixed Length"
path: "/angularjs-filter-number-fixed-length/"
tags: ["AngularJS"]
excerpt: Sometimes you want a number of a certain length. If it’s not of that length it needs leading zeros. AngularJS provides the number filter. However this lacks the possibility to have leading zeros.
created: 2013-12-11
updated: 2013-12-11
---


Sometimes you want a number of a certain length. If it’s not of that length it needs leading zeros. AngularJS provides the [number filter](https://docs.angularjs.org/api/ng/filter/number). However this lacks the possibility to have leading zeros.

AngularJS is very extendable. You can make your own leading zeros filter in just a few minutes. The creation of a custom AngularJS filter needs three things.

- Create a module
- Create the filter and his function
- Register the module in the application

## The AngularJS Filter

The JSFiddle belows shows a filter that gives you leading zeros.
