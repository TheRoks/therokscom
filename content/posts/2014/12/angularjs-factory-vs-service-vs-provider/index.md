---
title: "AngularJS: Factory vs Service vs Provider"
path: "/angularjs-factory-vs-service-vs-provider"
tags: ["AngularJS"]
excerpt: To try to get my head around the differences of the factory’s, services and provider in AngularJS. This can be all very similar on first sight. However there are some differences between the three of them. I’ll try to explain how they work and which to choose when.
created: 2014-12-27
updated: 2014-12-27
---

To try to get my head around the differences of the factory’s, services and provider in AngularJS. This can be all very similar on first sight. However there are some differences between the three of them. I’ll try to explain how they work and which to choose when.

## Factory

A factory is probably the used and the most common used of the three.

**Syntax**: `module.factory('factoryName', function);`

**Result**: When declaring factoryName as an injectable argument you will be provided the value that is returned by invoking the function reference passed to module.factory. In other words, on every call the arguments passed in again.

**Usage**: Could be useful for returning a ‘class’ function that can then be new’ed to create instances.

## Service

A service is quite similar to a factory. There are some small differences however.

**Syntax**: `module.service(‘serviceName’, function);`

**Result**: When declaring serviceName as an injectable argument you will be provided with the instance of a function passed to module.service. This differs from the factory

**Usage**: Could be useful for sharing utility functions that are useful to invoke by simply appending () to the injected function reference. Could also be run with injectedArg.call(this) or similar.

## Provider

Provider is the most configurable of all three.  All other providers are derived from it. It enables us define how the service will be provided even before the injection system is in place. This is achieved with configure call where we register work during the modules configuration phase.

**Syntax**: `module.provider( ‘providerName’, function );`

**Result**: When declaring providerName as an injectable argument you will be provided the value that is returned by invoking the $get method of the function reference passed to module.provider.

**Usage**: Could be useful for returning a ‘class’ function that can then be new’ed to create instances but that requires some sort of configuration before being injected. Perhaps useful for classes that are reusable across projects.

## What to choose

As usual, it depends. The factory has the Revealing Module pattern which gives the possibility to hide private variables. This can be very useful. However if you don’t have them and the injection of the service isn’t a problem for you, the service can be useful for you as well. The provider is the last in line to use. In most cases you won’t use this one. Use this only when you need the config part. This can be very handy when developing services that were shared of applications.

Hope this clarifies a little for you.
